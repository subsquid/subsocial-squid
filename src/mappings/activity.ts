import { Account, Space, Post, Activity, Reaction } from '../model';
import { EventName } from '../common/types';
import { ensureAccount } from './account';
import { ensureSpace } from './space';
import { ensurePost } from './post';
import { EntityProvideFailWarning } from '../common/errors';
import { getActivityEntityId, decorateEventName } from './utils';
import { EventHandlerContext } from '../common/contexts';

export const setActivity = async ({
  account,
  ctx,
  space,
  post,
  reaction,
  followingAccount
}: {
  account: Account | string;
  ctx: EventHandlerContext;
  space?: Space | string;
  post?: Post;
  reaction?: Reaction;
  followingAccount?: Account | string;
}): Promise<Activity | null> => {
  const { indexInBlock, name: eventName } = ctx.event;
  const { height: blockNumber } = ctx.block;
  const eventNameDecorated = decorateEventName(eventName);

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
  activity.event = EventName[eventNameDecorated as keyof typeof EventName];
  activity.date = new Date();

  let comment: boolean | Post = false;
  let commentParent = null;

  // TODO check do we need to save Post or just ID
  if (post && post.isComment && post.rootPost && !post.parentPost) {
    comment = post;
    commentParent = post.rootPost;
  } else if (post && post.isComment && post.rootPost && post.parentPost) {
    comment = post;
    commentParent = post.parentPost;
  }

  /**
   * AccountFollowed
   * AccountUnfollowed
   */
  if (
    (eventNameDecorated === EventName.AccountFollowed ||
      eventNameDecorated === EventName.AccountUnfollowed) &&
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
  if (eventNameDecorated === EventName.PostCreated && post) {
    activity.post = post;
    activity.space = post.space;
  }
  if (
    eventNameDecorated === EventName.PostCreated &&
    comment &&
    commentParent
  ) {
    activity.space = comment.space;
    activity.commentPost = comment;
    activity.commentParentPost = commentParent;
  }

  /**
   * SpaceCreated
   * SpaceUpdated
   * SpaceFollowed
   * SpaceUnfollowed
   */
  if (
    (eventNameDecorated === EventName.SpaceCreated ||
      EventName.SpaceUpdated ||
      eventNameDecorated === EventName.SpaceFollowed ||
      EventName.SpaceUnfollowed) &&
    space
  ) {
    const spaceInst =
      space instanceof Space ? space : await ensureSpace({ space, ctx });

    if (!spaceInst || !('id' in spaceInst)) {
      new EntityProvideFailWarning(
        Space,
        typeof space === 'string' ? space : space.id,
        ctx
      );
      return null;
    }
    activity.space = spaceInst;
  }

  /**
   * PostReactionCreated
   * PostReactionUpdated
   * PostReactionDeleted
   */
  if (
    (eventNameDecorated === EventName.PostReactionCreated ||
      eventNameDecorated === EventName.PostReactionUpdated) &&
    post &&
    reaction
  ) {
    activity.reaction = reaction;
    activity.post = post;
    activity.space = post.space;
  }
  if (
    (eventNameDecorated === EventName.PostReactionCreated ||
      eventNameDecorated === EventName.PostReactionUpdated) &&
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

  if (eventNameDecorated === EventName.PostReactionDeleted && post) {
    activity.post = post;
    activity.space = post.space;
  }

  if (
    eventNameDecorated === EventName.PostReactionDeleted &&
    reaction &&
    !post &&
    comment &&
    commentParent
  ) {
    activity.space = comment.space;
    activity.commentPost = comment;
    activity.commentParentPost = commentParent;
  }

  await ctx.store.save<Activity>(activity);

  return activity;
  // TODO review activities handling
};
