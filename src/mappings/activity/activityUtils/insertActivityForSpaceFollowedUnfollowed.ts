import { Activity, Space } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';

type InsertActivityForSpaceFollowedUnfollowedParams = {
  space: Space;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForSpaceFollowedUnfollowed(
  params: InsertActivityForSpaceFollowedUnfollowedParams
): Promise<Activity> {
  const { activity, space, ctx } = params;

  activity.space = space;
  activity.aggregated = activity.account.id !== space.ownedByAccount.id;
  activity.aggCount = BigInt(
    ensurePositiveOrZeroValue(space.followersCount - 1)
  );
  await updateAggregatedStatus({
    eventName: activity.event,
    space,
    ctx
  });
  return activity;
}
