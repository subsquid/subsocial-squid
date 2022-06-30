import { Account, Post, Activity, Space } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';
import { ensureSpace } from '../space';
import { EntityProvideFailWarning } from '../../common/errors';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForSpaceFollowedUnfollowedParams = {
  eventName: EventName;
  space: Space;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForSpaceFollowedUnfollowed(
  params: InsertActivityForSpaceFollowedUnfollowedParams
): Promise<Activity> {
  const { eventName, activity, space, ctx } = params;

  activity.space = space;
  activity.aggregated = activity.account.id !== space.ownerAccount.id;
  activity.aggCount = BigInt(
    !space.followersCount ? 0 : space.followersCount - 1
  );
  await updateAggregatedStatus({
    eventName,
    space,
    ctx
  });
  return activity;
}
