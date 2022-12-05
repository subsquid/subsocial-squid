import { handleEvent } from './common';
import { Ctx } from '../../processor';
import { AccountUnfollowedData } from '../../common/types';

export async function accountUnfollowed(
  ctx: Ctx,
  eventData: AccountUnfollowedData
): Promise<void> {
  await handleEvent(eventData.followerId, eventData.accountId, ctx, eventData);
}
