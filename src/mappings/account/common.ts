import { Account } from '../../model';
import { Ctx } from '../../processor';

export async function ensureAccount(
  accountId: string,
  ctx: Ctx,
  debugId: string = ''
): Promise<Account> {
  ctx.log.warn(`DEBUG - ${debugId}`);
  if (accountId === null || !accountId)
    throw new Error(`Account has unsupported value - ${debugId}`);

  let account = await ctx.store.get(Account, accountId, false);

  if (account) return account;

  account = new Account();
  account.id = accountId;
  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;
  account.followingPostsCount = 0;

  await ctx.store.deferredUpsert(account);

  return account;
}
