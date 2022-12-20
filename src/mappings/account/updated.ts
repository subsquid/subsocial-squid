import { setActivity } from '../activity';
import { getOrCreateAccount } from './common';
import { Ctx } from '../../processor';
import { ProfileUpdatedData } from '../../common/types';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

export async function accountUpdated(
  ctx: Ctx,
  eventData: ProfileUpdatedData
): Promise<void> {
  const account = await getOrCreateAccount(eventData.accountId, ctx);

  account.updatedAtTime = eventData.timestamp;
  account.updatedAtBlock = BigInt(eventData.blockNumber.toString());

  if (
    (eventData.spaceId && !account.profileSpace) ||
    (eventData.spaceId &&
      account.profileSpace &&
      account.profileSpace.id !== eventData.spaceId)
  ) {
    const accountSpace = await getEntityWithRelations.space(
      eventData.spaceId,
      ctx
    );

    account.profileSpace = accountSpace;

    await ctx.store.save(account);

    if (accountSpace) {
      accountSpace.profileSpace = account;
      await ctx.store.save(accountSpace);
    }
  } else {
    await ctx.store.save(account);
  }

  await setActivity({
    account,
    ctx,
    eventData
  });
}
