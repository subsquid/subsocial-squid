import { Account, Activity } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';

type InsertActivityForAccountFollowedUnfollowedParams = {
  followingAccount: Account;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForAccountFollowedUnfollowed(
  params: InsertActivityForAccountFollowedUnfollowedParams
): Promise<Activity> {
  const { activity, followingAccount, ctx } = params;

  activity.followingAccount = followingAccount;
  activity.aggregated = true;
  activity.aggCount = BigInt(
    ensurePositiveOrZeroValue(followingAccount.followersCount - 1)
  );

  await updateAggregatedStatus({
    eventName: activity.event,
    followingAccount,
    ctx
  });

  return activity;
}
