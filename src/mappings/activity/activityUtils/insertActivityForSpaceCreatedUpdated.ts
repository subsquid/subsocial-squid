import { Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForSpaceCreatedUpdatedParams = {
  space: Space;
  activity: Activity;
  ctx: Ctx;
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
