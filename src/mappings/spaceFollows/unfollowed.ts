import { SpaceFollowsSpaceUnfollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';

export async function spaceUnfollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);

  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  const [followerId, spaceId] = event.asV1;

  await handleEvent(addressSs58ToString(followerId), spaceId.toString(), ctx);
}
