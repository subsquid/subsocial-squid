import { Account, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';
import { updateAggregatedStatus } from './aggregationUtils';

type InsertActivityForSpaceOwnershipTransferParams = {
  space: Space;
  oldOwner: Account;
  activity: Activity;
  ctx: Ctx;
};

export async function insertActivityForSpaceOwnershipTransfer(
  params: InsertActivityForSpaceOwnershipTransferParams
): Promise<Activity> {
  const { activity, oldOwner, space } = params;

  activity.space = space;
  activity.newOwner = space.ownedByAccount;
  activity.oldOwner = oldOwner;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
