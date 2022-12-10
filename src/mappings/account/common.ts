import { Account } from '../../model';
import { Ctx } from '../../processor';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

export async function getOrCreateAccount(
  accountId: string,
  ctx: Ctx,
  debugId: string = ''
): Promise<Account> {
  if (accountId === null || !accountId)
    throw new Error(`Account ID has unsupported value - ${debugId}`);

  let account = await getEntityWithRelations.account(accountId, ctx);

  if (account) return account;

  account = new Account();
  account.id = accountId;
  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;
  account.followingPostsCount = 0;

  await ctx.store.save(account);

  return account;
}
