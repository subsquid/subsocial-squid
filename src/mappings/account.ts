import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account } from '../model';

export async function ensureAccount(
  accountId: string,
  ctx: EventHandlerContext
) {
  const account = await ctx.store.get(Account, accountId);

  if (account) return account;

  const newAccount = new Account();

  newAccount.id = accountId;
  newAccount.followers = [];
  newAccount.followersCount = 0;
  newAccount.followingAccounts = [];
  newAccount.followingAccountsCount = 0;
  newAccount.posts = [];
  newAccount.spacesCreated = [];
  newAccount.spacesOwned = [];
  newAccount.spacesFollowed = [];
  newAccount.followingSpacesCount = 0;
  newAccount.feeds = [];
  newAccount.notifications = [];

  return ctx.store.save<Account>(newAccount);
}
