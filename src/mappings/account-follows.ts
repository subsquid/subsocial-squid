import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Account, AccountFollowers, Activity } from '../model';
import {
  ProfileFollowsAccountFollowedEvent,
  ProfileFollowsAccountUnfollowedEvent
} from '../types/events';
import {
  EventAction,
  addressSs58ToString,
  getAccountFollowersEntityId,
  printEventLog
} from './utils';
import { ensureAccount } from './account';
import { setActivity } from './activity';
import { deleteAccountPostsFromFeedForAccount } from './news-feed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutAccount
} from './notification';

export async function accountFollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfileFollowsAccountFollowedEvent(ctx);

  const [followerId, followingId] = event.asV1;

  await handleEvent(
    addressSs58ToString(followerId),
    addressSs58ToString(followingId),
    ctx
  );
}

export async function accountUnfollowed(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  const event = new ProfileFollowsAccountUnfollowedEvent(ctx);

  const [followerId, followingId] = event.asV1;

  await handleEvent(
    addressSs58ToString(followerId),
    addressSs58ToString(followingId),
    ctx
  );
}

async function handleEvent(
  followerId: string,
  followingId: string,
  ctx: EventHandlerContext
) {
  const followerAccount = await ensureAccount(followerId, ctx, true);
  const followingAccount = await ensureAccount(followingId, ctx, true);

  if (!followerAccount || !followingAccount) return;

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

const processAccountFollowingUnfollowingRelations = async (
  followerAccount: Account,
  followingAccount: Account,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<void> => {
  const { method } = ctx.event;

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

  if (method === EventAction.AccountFollowed) {
    if (accountFollowersEntity) return;
    currentFollowersCountOfFollowingAcc += 1;
    currentFollowingCountOfFollowerAcc += 1;

    const newAccountFollowersEnt = new AccountFollowers();

    newAccountFollowersEnt.id = AccountFollowersEntityId;
    newAccountFollowersEnt.followerAccount = followerAccount;
    newAccountFollowersEnt.followingAccount = followingAccount;

    await ctx.store.save<AccountFollowers>(newAccountFollowersEnt);
    await addNotificationForAccount(followingAccount, activity, ctx);
  } else if (method === EventAction.AccountUnfollowed) {
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
