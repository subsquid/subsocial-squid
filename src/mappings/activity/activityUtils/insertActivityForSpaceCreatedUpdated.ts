import { Activity, Space } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForSpaceCreatedUpdatedParams = {
  space: Space;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForSpaceCreatedUpdated(
  params: InsertActivityForSpaceCreatedUpdatedParams
): Promise<Activity> {
  const { activity, space, ctx } = params;

  activity.space = space;
  activity.aggregated = true;
  activity.aggCount = BigInt(0);

  await updateAggregatedStatus({
    eventName: activity.event,
    space,
    ctx
  });

  return activity;
}
