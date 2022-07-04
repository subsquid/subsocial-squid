import { Account } from '../../model';
import { resolveAccount } from '../../connection/resolvers/resolveAccountData';
import { MissingSubsocialApiEntity } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

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
