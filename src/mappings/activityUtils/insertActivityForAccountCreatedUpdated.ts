import { Account, Activity } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForAccountCreatedUpdatedParams = {
  activity: Activity;
};

export async function insertActivityForAccountCreatedUpdated(
  params: InsertActivityForAccountCreatedUpdatedParams
): Promise<Activity> {
  const { activity } = params;

  activity.aggregated = false;
  activity.aggCount = BigInt(0);

  return activity;
}
