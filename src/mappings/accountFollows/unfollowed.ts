import { AccountFollowsAccountUnfollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';

export async function accountUnfollowed(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  const event = new AccountFollowsAccountUnfollowedEvent(ctx);

  const { follower: followerId, account: followingId } = event.asV13;

  await handleEvent(
    addressSs58ToString(followerId),
    addressSs58ToString(followingId),
    ctx
  );
}
