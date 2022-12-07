import { Account, AccountFollowers, Activity, EventName } from '../../model';
import { Ctx } from '../../processor';
import {
  getAccountFollowersEntityId,
  decorateEventName
} from '../../common/utils';
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import { deleteAccountPostsFromFeedForAccount } from '../newsFeed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutAccount
} from '../notification';
import { EventHandlerContext } from '../../common/contexts';
import { EventData } from '../../common/types';

export async function handleEvent(
  followerId: string,
  followingId: string,
  ctx: Ctx,
  eventData: EventData
): Promise<void> {
  const followerAccount = await ensureAccount(followerId, ctx, '4e4d784c-df03-4498-ad2f-4f49dc4e7bc5');
  const followingAccount = await ensureAccount(followingId, ctx, '3ac27014-207e-469b-9ffe-fe7bfd90699f');

  const activity = await setActivity({
    account: followerAccount,
    followingAccount,
    ctx,
    eventData
  });

  if (!activity) return;

  await processAccountFollowingUnfollowingRelations({
    followerAccount,
    followingAccount,
    activity,
    ctx,
    eventData
  });
}

export const processAccountFollowingUnfollowingRelations = async ({
  followerAccount,
  followingAccount,
  activity,
  ctx,
  eventData
}: {
  followerAccount: Account;
  followingAccount: Account;
  activity: Activity;
  ctx: Ctx;
  eventData: EventData;
}): Promise<void> => {
  const { name } = eventData;
  const eventNameDecorated = decorateEventName(name);

  const accountFollowersEntityId = getAccountFollowersEntityId(
    followerAccount.id,
    followingAccount.id
  );
  const accountFollowersEntity = await ctx.store.get(
    AccountFollowers,
    accountFollowersEntityId,
    false
  );

  let currentFollowersCountOfFollowingAcc =
    followingAccount.followersCount || 0;
  let currentFollowingCountOfFollowerAcc =
    followerAccount.followingAccountsCount || 0;

  if (eventNameDecorated === EventName.AccountFollowed) {
    if (accountFollowersEntity) return;
    currentFollowersCountOfFollowingAcc += 1;
    currentFollowingCountOfFollowerAcc += 1;

    const newAccountFollowersEnt = new AccountFollowers({
      id: accountFollowersEntityId,
      followerAccount: followerAccount,
      followingAccount: followingAccount
    });

    ctx.store.deferredUpsert(newAccountFollowersEnt);

    await addNotificationForAccount(followingAccount, activity, ctx);
  } else if (eventNameDecorated === EventName.AccountUnfollowed) {
    if (!accountFollowersEntity) return;
    currentFollowersCountOfFollowingAcc -= 1;
    currentFollowingCountOfFollowerAcc -= 1;
    ctx.store.deferredUpsert(accountFollowersEntity);

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

  await ctx.store.deferredUpsert([followerAccount, followingAccount]);
};
