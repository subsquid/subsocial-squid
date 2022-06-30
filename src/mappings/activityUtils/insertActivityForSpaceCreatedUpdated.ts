import { Account, Post, Activity, Space } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForSpaceCreatedUpdatedParams = {
  eventName: EventName;
  space: Space;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForSpaceCreatedUpdated(
  params: InsertActivityForSpaceCreatedUpdatedParams
): Promise<Activity> {
  const { eventName, activity, space, ctx } = params;

  activity.space = space;
  activity.aggregated = true;
  activity.aggCount = BigInt(0);

  await updateAggregatedStatus({
    eventName,
    space,
    ctx
  });

  return activity;
}
