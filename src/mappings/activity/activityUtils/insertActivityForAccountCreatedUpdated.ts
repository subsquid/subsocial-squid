import { Activity } from '../../../model';

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
