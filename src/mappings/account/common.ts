import { Account } from '../../model';
// import { resolveAccount } from '../../connection/resolvers/resolveAccountData';
import { MissingSubsocialApiEntity } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

export async function ensureAccount(
  accountId: string,
  ctx: EventHandlerContext
): Promise<Account> {
  let account = await ctx.store.get(Account, {
    where: { id: accountId },
    relations: { profileSpace: true }
  });

  if (account) return account;

  account = new Account();
  account.id = accountId;
  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;
  account.followingPostsCount = 0;

  await ctx.store.save<Account>(account);

  return account;
}
