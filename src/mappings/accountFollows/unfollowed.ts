import { ProfileFollowsAccountUnfollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';

export async function accountUnfollowed(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  const event = new ProfileFollowsAccountUnfollowedEvent(ctx);

  const [followerId, followingId] = event.asV1;

  await handleEvent(
    addressSs58ToString(followerId),
    addressSs58ToString(followingId),
    ctx
  );
}
