import { Account, Reaction } from '../model';
import {
  ProfilesProfileCreatedEvent,
  ProfilesProfileUpdatedEvent
} from '../types/events';
import {
  addressSs58ToString,
  validateEventHandlerInputs,
  printEventLog
} from './utils';
import { resolveAccount } from './resolvers/resolveAccountData';
import { setActivity } from './activity';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../common/errors';
import { EventHandlerContext } from '../common/contexts';

export async function accountCreated(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfilesProfileCreatedEvent(ctx);

  validateEventHandlerInputs(ctx);

  const accountIdString = addressSs58ToString(event.asV1);

  const account: Account | null = await ensureAccount(accountIdString, ctx);

  if (account) {
    await ctx.store.save<Account>(account);
    await setActivity({
      account,
      ctx
    });
  }
}

export async function accountUpdated(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfilesProfileUpdatedEvent(ctx);

  validateEventHandlerInputs(ctx);

  const accountIdString = addressSs58ToString(event.asV1);

  const account = await ctx.store.get(Account, accountIdString);

  if (!account) {
    new EntityProvideFailWarning(Account, accountIdString, ctx);
    return;
  }

  const accountData = await resolveAccount(accountIdString);

  if (!accountData || !accountData.struct) {
    new MissingSubsocialApiEntity('ProfileData', ctx);
    return;
  }
  const { struct: accountStruct, content: accountContent = null } = accountData;

  if (
    accountStruct &&
    accountStruct.createdAtBlock &&
    accountStruct.createdAtTime
  ) {
    account.createdAtBlock = BigInt(accountStruct.createdAtBlock);
    account.createdAtTime = new Date(accountStruct.createdAtTime);
    account.reputation = accountStruct.reputation;
  }

  if (accountContent) {
    account.name = accountContent.name;
    account.avatar = accountContent.avatar;
    account.about = accountContent.about;
  }

  if (account) {
    await ctx.store.save<Account>(account);
    await setActivity({
      account,
      ctx
    });
  }
}

export async function ensureAccount(
  accountId: string,
  ctx: EventHandlerContext
): Promise<Account | null> {
  let account = await ctx.store.get(Account, accountId);

  if (account) return account;

  const accountData = await resolveAccount(accountId);

  if (!accountData || !accountData.struct) {
    new MissingSubsocialApiEntity('ProfileData', ctx);
    return null;
  }

  const { struct: accountStruct, content: accountContent = null } = accountData;
  account = new Account();
  account.id = accountId;
  account.reputation = accountStruct.reputation;
  account.hasProfile = accountStruct.hasProfile;
  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;

  if (
    accountStruct &&
    accountStruct.createdAtBlock &&
    accountStruct.createdAtTime
  ) {
    account.createdAtBlock = BigInt(accountStruct.createdAtBlock);
    account.createdAtTime = new Date(accountStruct.createdAtTime);
  }

  if (accountContent) {
    account.name = accountContent.name;
    account.avatar = accountContent.avatar;
    account.about = accountContent.about;
  }

  await ctx.store.save<Account>(account);

  return account;
}
