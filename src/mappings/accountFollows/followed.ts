import { AccountFollowsAccountFollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import { handleEvent } from './common';

export async function accountFollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event: AccountFollowsAccountFollowedEvent =
    new AccountFollowsAccountFollowedEvent(ctx);

  const { follower: followerId, account: followingId } = event.asV13;

  await handleEvent(
    addressSs58ToString(followerId),
    addressSs58ToString(followingId),
    ctx
  );
}
