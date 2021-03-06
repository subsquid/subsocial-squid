import { Account } from '../../model';
import { ProfilesProfileUpdatedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { resolveAccount } from '../../connection/resolvers/resolveAccountData';
import { setActivity } from '../activity';
import { ensureAccount } from './common';
import { MissingSubsocialApiEntity } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

export async function accountUpdated(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfilesProfileUpdatedEvent(ctx);

  const accountIdString = addressSs58ToString(event.asV1);

  const account = await ensureAccount(accountIdString, ctx);

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

  await ctx.store.save<Account>(account);
  await setActivity({
    account,
    ctx
  });
}
