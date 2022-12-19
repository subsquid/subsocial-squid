import { handleEvent } from './common';
import { Ctx } from '../../processor';
import { SpaceFollowedData } from '../../common/types';

export async function spaceFollowed(
  ctx: Ctx,
  eventData: SpaceFollowedData
): Promise<void> {
  await handleEvent(eventData.followerId, eventData.spaceId, ctx, eventData);
}
