import { Account } from '../../model';
import { resolveAccount } from '../../connection/resolvers/resolveAccountData';
import { MissingSubsocialApiEntity } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

export async function ensureAccount(
  accountId: string,
  ctx: EventHandlerContext
): Promise<Account> {
  let account = await ctx.store.get(Account, accountId);

  if (account) return account;

  const accountData = await resolveAccount(accountId);

  if (!accountData || !accountData.struct) {
    new MissingSubsocialApiEntity('ProfileData', ctx);
  }

  account = new Account();
  account.id = accountId;
  account.followersCount = 0;
  account.followingAccountsCount = 0;
  account.followingSpacesCount = 0;
  account.followingPostsCount = 0;

  if (accountData && accountData.struct) {
    const { struct } = accountData;
    account.createdAtBlock = struct.createdAtBlock
      ? BigInt(struct.createdAtBlock)
      : null;
    account.createdAtTime = struct.createdAtTime
      ? new Date(struct.createdAtTime)
      : null;
    account.reputation = struct.reputation;
    account.hasProfile = struct.hasProfile;
  }

  if (accountData && accountData.content) {
    const { content } = accountData;
    account.name = content.name;
    account.avatar = content.avatar;
    account.about = content.about;
  }

  await ctx.store.save<Account>(account);

  return account;
}
