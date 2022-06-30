import { Account, Activity } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';

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
    !followingAccount.followersCount ? 0 : followingAccount.followersCount - 1
  );

  await updateAggregatedStatus({
    eventName,
    followingAccount,
    ctx
  });

  return activity;
}
