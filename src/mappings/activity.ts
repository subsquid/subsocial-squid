import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Account, Space, Post, Activity, Reaction } from '../model';
import { EventAction } from '../common/types';
import { ensureAccount } from './account';
import { ensureSpace } from './space';
import { ensurePost } from './post';
import { EntityProvideFailWarning } from '../common/errors';
import { getActivityEntityId } from './utils';

export const setActivity = async ({
  account,
  ctx,
  space,
  post,
  reaction,
  // comment,
  // commentParent,
  followingAccount
}: {
  account: Account | string;
  ctx: EventHandlerContext;
  space?: Space | string;
  post?: Post;
  reaction?: Reaction;
  // comment?: Post;
  // commentParent?: Post;
  followingAccount?: Account | string;
}): Promise<Activity | null> => {
  const { method, blockNumber, indexInBlock } = ctx.event;

  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) {
    new EntityProvideFailWarning(
      Account,
      typeof account === 'string' ? account : account.id,
      ctx
    );
    return null;
  }

  const activity = new Activity();
  activity.id = getActivityEntityId(
    blockNumber.toString(),
    indexInBlock.toString()
  );
  activity.account = accountInst;
  activity.blockNumber = BigInt(blockNumber.toString());
  activity.eventIndex = indexInBlock;
  activity.event = EventAction[method as keyof typeof EventAction];
  activity.date = new Date();

  let comment: boolean | Post = false;
  let commentParent = null;

  // TODO check do we need to save Post or just ID
  if (post && post.isComment && post.rootPostId && !post.parentId) {
    comment = post;
    commentParent = await ensurePost({
      account: post.createdByAccount,
      postId: post.rootPostId,
      ctx
    });
  } else if (post && post.isComment && post.rootPostId && post.parentId) {
    comment = post;
    commentParent = await ensurePost({
      account: post.createdByAccount,
      postId: post.parentId,
      ctx
    });
  }

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
  }

  /**
   * PostReactionCreated
   * PostReactionUpdated
   * PostReactionDeleted
   */
  if (
    (method === EventAction.PostReactionCreated ||
      method === EventAction.PostReactionUpdated) &&
    post &&
    reaction
  ) {
    activity.reaction = reaction;
    activity.post = post;
    activity.space = post.space;
  }
  if (
    (method === EventAction.PostReactionCreated ||
      method === EventAction.PostReactionUpdated) &&
    reaction &&
    !post &&
    comment &&
    commentParent
  ) {
    activity.reaction = reaction;
    activity.space = comment.space;
    activity.commentPost = comment;
    activity.commentParentPost = commentParent;
  }

  if (method === EventAction.PostReactionDeleted && post) {
    activity.post = post;
    activity.space = post.space;
  }

  if (
    method === EventAction.PostReactionDeleted &&
    reaction &&
    !post &&
    comment &&
    commentParent
  ) {
    activity.space = comment.space;
    activity.commentPost = comment;
    activity.commentParentPost = commentParent;
  }

  return ctx.store.save<Activity>(activity);

  // TODO review activities handling
};
