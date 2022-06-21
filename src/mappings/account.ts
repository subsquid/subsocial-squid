import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account } from '../model';
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

export async function accountCreated(ctx: EventHandlerContext) {
  printEventLog(ctx);
  const event = new ProfilesProfileCreatedEvent(ctx);

  validateEventHandlerInputs(ctx);

  const accountId = event.asV1;
  const accountIdString = addressSs58ToString(accountId);

  const account: Account | null = await ensureAccount(accountIdString, ctx);

  if (account) {
    await ctx.store.save<Account>(account);
    await setActivity({
      account,
      ctx
    });
  }
}

export async function accountUpdated(ctx: EventHandlerContext) {
  printEventLog(ctx);
  const event = new ProfilesProfileUpdatedEvent(ctx);

  validateEventHandlerInputs(ctx);

  const accountId = event.asV1;
  const accountIdString = addressSs58ToString(accountId);

  const account: Account | null = await ensureAccount(accountIdString, ctx);

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
  ctx: EventHandlerContext,
  createIfNotExists = false
): Promise<Account | null> {
  const accountData = await resolveAccount(accountId);

  if (!accountData || !accountData.struct) return null;

  const { struct: accountStruct, content: accountContent = null } = accountData;

  let account = await ctx.store.get(Account, accountId);

  if (!account) {
    account = new Account();
    account.id = accountId;
  }
  account.reputation = accountStruct.reputation;
  account.hasProfile = accountStruct.hasProfile;
  account.name = accountContent ? accountContent.name : '';
  account.avatar = accountContent ? accountContent.avatar : '';
  account.about = accountContent ? accountContent.about : '';

  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;

  if (createIfNotExists && account) return ctx.store.save<Account>(account);

  return account;
}
