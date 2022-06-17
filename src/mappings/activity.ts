import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Account, Space, Post, Activity } from '../model';
import { EventAction, addressSs58ToString } from './utils';
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
}): Promise<Activity | null> => {
  const { method, blockNumber, indexInBlock } = ctx.event;

  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) return null;

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
    if (!followingAccountInst) return null;
    activity.followingAccount = followingAccountInst;
  }
  /**
   * PostCreated
   */
  if (method === EventAction.PostCreated && post) {
    activity.post = post;
    activity.space = post.space;
    // TODO Add Activity/Notification for following creator account to created post as owner
  }
  if (method === EventAction.PostCreated && !post && comment && commentParent) {
    activity.space = comment.space;
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
      space instanceof Space
        ? space
        : await ensureSpace({ space, ctx, createIfNotExists: true });

    if (!spaceInst || !('id' in spaceInst)) return null;
    activity.space = spaceInst;

    // /**
    //  * Set notification for Space owner
    //  */
    // if (method === EventAction.SpaceFollowed) {
    //   await addNotificationForAccount(spaceInst.ownerAccount, activity, ctx);
    // }
    // if (method === EventAction.SpaceUnfollowed) {
    //   await deleteNotifications(spaceInst.ownerAccount, activity, ctx);
    // }
  }

  return ctx.store.save<Activity>(activity);
};
