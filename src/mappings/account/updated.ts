import { Account, Space } from '../../model';
import { ProfilesProfileUpdatedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { setActivity } from '../activity';
import { ensureAccount } from './common';
import { EventHandlerContext } from '../../common/contexts';
import { Ctx } from '../../processor';
import { ProfileUpdatedData } from '../../common/types';

export async function accountUpdated(
  ctx: Ctx,
  eventData: ProfileUpdatedData
): Promise<void> {
  const account = await ensureAccount(eventData.accountId, ctx);

  account.updatedAtTime = eventData.timestamp;
  account.updatedAtBlock = BigInt(eventData.blockNumber.toString());

  if (
    (eventData.spaceId &&
      (!account.profileSpace || !account.profileSpace.id)) ||
    (eventData.spaceId &&
      account.profileSpace &&
      account.profileSpace.id &&
      account.profileSpace.id !== eventData.spaceId)
  ) {
    const accountSpace = await ctx.store.get(Space, eventData.spaceId, false);

    account.profileSpace = accountSpace;

    await ctx.store.deferredUpsert(account);

    if (accountSpace) {
      accountSpace.profileSpace = account;
      await ctx.store.deferredUpsert(accountSpace);
    }
  } else {
    await ctx.store.deferredUpsert(account);
  }

  await setActivity({
    account,
    ctx,
    eventData
  });
}
