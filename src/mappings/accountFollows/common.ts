import { Account, AccountFollowers, Activity } from '../../model';
import {
  getAccountFollowersEntityId,
  decorateEventName
} from '../../common/utils';
import { EventName } from '../../common/types';
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import { deleteAccountPostsFromFeedForAccount } from '../newsFeed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutAccount
} from '../notification';
import { EventHandlerContext } from '../../common/contexts';

export async function handleEvent(
  followerId: string,
  followingId: string,
  ctx: EventHandlerContext
): Promise<void> {
  const followerAccount = await ensureAccount(followerId, ctx);
  const followingAccount = await ensureAccount(followingId, ctx);

  const activity = await setActivity({
    account: followerAccount,
    followingAccount,
    ctx
  });

  if (!activity) return;

  await processAccountFollowingUnfollowingRelations(
    followerAccount,
    followingAccount,
    activity,
    ctx
  );
}

export const processAccountFollowingUnfollowingRelations = async (
  followerAccount: Account,
  followingAccount: Account,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<void> => {
  const { name } = ctx.event;
  const eventNameDecorated = decorateEventName(name);

  const AccountFollowersEntityId = getAccountFollowersEntityId(
    followerAccount.id,
    followingAccount.id
  );
  const accountFollowersEntity = await ctx.store.get(
    AccountFollowers,
    AccountFollowersEntityId
  );

  let currentFollowersCountOfFollowingAcc =
    followingAccount.followersCount || 0;
  let currentFollowingCountOfFollowerAcc =
    followerAccount.followingAccountsCount || 0;

  if (eventNameDecorated === EventName.AccountFollowed) {
    if (accountFollowersEntity) return;
    currentFollowersCountOfFollowingAcc += 1;
    currentFollowingCountOfFollowerAcc += 1;

    const newAccountFollowersEnt = new AccountFollowers();

    newAccountFollowersEnt.id = AccountFollowersEntityId;
    newAccountFollowersEnt.followerAccount = followerAccount;
    newAccountFollowersEnt.followingAccount = followingAccount;

    await ctx.store.save<AccountFollowers>(newAccountFollowersEnt);
    await addNotificationForAccount(followingAccount, activity, ctx);
  } else if (eventNameDecorated === EventName.AccountUnfollowed) {
    if (!accountFollowersEntity) return;
    currentFollowersCountOfFollowingAcc -= 1;
    currentFollowingCountOfFollowerAcc -= 1;
    await ctx.store.remove<AccountFollowers>(accountFollowersEntity);
    await addNotificationForAccount(followingAccount, activity, ctx);
    await deleteAllNotificationsAboutAccount(
      followerAccount,
      followingAccount,
      ctx
    );
    await deleteAccountPostsFromFeedForAccount(
      followerAccount,
      followingAccount,
      ctx
    );
  }

  /**
   * Update accounts counters
   */
  followerAccount.followingAccountsCount = currentFollowingCountOfFollowerAcc;
  followingAccount.followersCount = currentFollowersCountOfFollowingAcc;

  await ctx.store.save<Account>([followerAccount, followingAccount]);
};
