import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account } from '../model';
import {
  ProfilesProfileCreatedEvent,
  ProfilesProfileUpdatedEvent
} from '../types/events';
import { addressSs58ToString } from './utils';
import {
  resolveAccount,
  resolveAccountStruct
} from './resolvers/resolveAccountData';
import { setActivity } from './activity';

export async function accountCreated(ctx: EventHandlerContext) {
  console.log('::::::::::::::::::::::: accountCreated :::::::::::::::::::::::');
  const event = new ProfilesProfileCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const accountId = event.asV1;
  const accountIdString = addressSs58ToString(accountId);

  const account: Account | null = await ensureAccount(accountIdString, ctx);

  if (account) {
    await ctx.store.save<Account>(account);
  }
}

export async function accountUpdated(ctx: EventHandlerContext) {
  console.log('::::::::::::::::::::::: accountUpdated :::::::::::::::::::::::');
  const event = new ProfilesProfileUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

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

  if (!accountData || !accountData.struct || !accountData.content) return null;

  const { struct: accountStruct, content: accountContent } = accountData;

  let account = await ctx.store.get(Account, accountId);

  if (!account) {
    account = new Account();
    account.id = accountId;
  }
  account.reputation = accountStruct.reputation;
  account.hasProfile = accountStruct.hasProfile;
  account.name = accountContent.name;
  account.avatar = accountContent.avatar;
  account.about = accountContent.about;

  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;

  if (createIfNotExists && account) return ctx.store.save<Account>(account);

  return account;
}
