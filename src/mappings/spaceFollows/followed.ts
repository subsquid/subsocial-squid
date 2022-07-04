import { SpaceFollowsSpaceFollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';

export async function spaceFollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [followerId, spaceId] = event.asV1;
  await handleEvent(addressSs58ToString(followerId), spaceId.toString(), ctx);
}
