import { SpaceFollowsSpaceUnfollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';
import { Ctx } from '../../processor';
import { SpaceUnfollowedData } from '../../common/types';

export async function spaceUnfollowed(
  ctx: Ctx,
  eventData: SpaceUnfollowedData
): Promise<void> {
  await handleEvent(eventData.followerId, eventData.spaceId, ctx, eventData);
}
