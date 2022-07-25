import { Account, Activity, EventName } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';

type InsertActivityForAccountFollowedUnfollowedParams = {
  eventName: EventName;
  followingAccount: Account;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForAccountFollowedUnfollowed(
  params: InsertActivityForAccountFollowedUnfollowedParams
): Promise<Activity> {
  const { eventName, activity, followingAccount, ctx } = params;

  activity.followingAccount = followingAccount;
  activity.aggregated = true;
  activity.aggCount = BigInt(
    ensurePositiveOrZeroValue(followingAccount.followersCount - 1)
  );

  await updateAggregatedStatus({
    eventName,
    followingAccount,
    ctx
  });

  return activity;
}
