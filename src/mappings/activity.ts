import BN from 'bn.js';
import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Account, Space, Post, Activity } from '../model';
import {
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent
} from '../types/events';
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { EventAction, addressSs58ToString } from './utils';
import { addNotification, deleteNotifications } from './notification';
import { ensureAccount } from './account';
import { ensureSpace } from './space';

export const setActivity = async ({
  account,
  ctx,
  space,
  post,
  comment,
  commentParent,
  followingAccount
}: {
  account: Account | string;
  ctx: EventHandlerContext;
  space?: Space | string;
  post?: Post;
  comment?: Post;
  commentParent?: Post;
  followingAccount?: Account | string;
}): Promise<void> => {
  const { method, blockNumber, indexInBlock } = ctx.event;
  console.log(
    `>>> method [${method}] >>> blockNumber [${blockNumber}] >>> indexInBlock [${indexInBlock}]`
  );

  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) return;

  const activity = new Activity();
  activity.id = `${blockNumber}-${indexInBlock}`;
  activity.account = accountInst;
  activity.blockNumber = BigInt(blockNumber.toString());
  activity.eventIndex = indexInBlock;
  activity.event = EventAction[method as keyof typeof EventAction];
  activity.date = new Date();

  /**
   * AccountFollowed
   * AccountUnfollowed
   */
  if (
    (method === EventAction.AccountFollowed ||
      method === EventAction.AccountUnfollowed) &&
    followingAccount
  ) {
    const followingAccountInst =
      followingAccount instanceof Account
        ? followingAccount
        : await ensureAccount(followingAccount, ctx);
    if (!followingAccountInst) return;
    activity.followingAccount = followingAccountInst;
  }
  /**
   * PostCreated
   */
  if (method === EventAction.PostCreated && post) {
    activity.post = post;
    // TODO Add Activity/Notification for following creator account to created post as owner
  }
  if (method === EventAction.PostCreated && !post && comment && commentParent) {
    activity.commentPost = comment;
    activity.commentParentPost = commentParent;
    // TODO Add Activity/Notification for following creator account to created post as owner
  }

  /**
   * SpaceCreated
   * SpaceUpdated
   * SpaceFollowed
   * SpaceUnfollowed
   */
  if (
    (method === EventAction.SpaceCreated ||
      EventAction.SpaceUpdated ||
      method === EventAction.SpaceFollowed ||
      EventAction.SpaceUnfollowed) &&
    space
  ) {
    const spaceInst =
      space instanceof Space ? space : await ensureSpace(space, ctx);

    if (!spaceInst || !('id' in spaceInst)) return;
    activity.space = spaceInst;

    // /**
    //  * Set notification for Space owner
    //  */
    // if (method === EventAction.SpaceFollowed) {
    //   await addNotification(spaceInst.ownerAccount, activity, ctx);
    // }
    // if (method === EventAction.SpaceUnfollowed) {
    //   await deleteNotifications(spaceInst.ownerAccount, activity, ctx);
    // }
  }

  await ctx.store.save<Activity>(activity);
};
