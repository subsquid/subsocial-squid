import { Account, Space, Post, Activity, Reaction } from '../model';
import { EventName } from '../common/types';
import { ensureAccount } from './account';
import { ensureSpace } from './space';
import { EntityProvideFailWarning } from '../common/errors';
import { getActivityEntityId, decorateEventName } from './utils';
import { EventHandlerContext } from '../common/contexts';

export const setActivity = async ({
  account,
  ctx,
  space,
  post,
  spacePrev,
  reaction,
  followingAccount
}: {
  account: Account | string;
  ctx: EventHandlerContext;
  space?: Space | string;
  spacePrev?: Space | string;
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
    if (!followingAccountInst) {
      new EntityProvideFailWarning(
        Account,
        typeof followingAccount === 'string'
          ? followingAccount
          : followingAccount.id,
        ctx
      );
    } else {
      activity.followingAccount = followingAccountInst;
      activity.aggregated = true;
      activity.aggCount = BigInt(
        !followingAccountInst.followersCount
          ? 0
          : followingAccountInst.followersCount - 1
      );
    }
  }
  /**
   * PostCreated
   */

  if (eventNameDecorated === EventName.PostCreated && post && !post.isComment) {
    // Regular Post
    activity.post = post;
    activity.space = post.space;
  } else if (
    eventNameDecorated === EventName.PostCreated &&
    post &&
    post.isComment &&
    post.rootPost
  ) {
    // Post Comment / Comment Reply
    activity.post = post;
    activity.space = post.rootPost.space;
  }

  /**
   * PostMoved
   */
  if (eventNameDecorated === EventName.PostMoved && post && spacePrev) {
    const spacePrevInst =
      spacePrev instanceof Space
        ? spacePrev
        : await ensureSpace({ space: spacePrev, ctx });

    if (!spacePrevInst || !('id' in spacePrevInst)) {
      new EntityProvideFailWarning(
        Space,
        typeof spacePrev === 'string' ? spacePrev : spacePrev.id,
        ctx
      );
    } else {
      activity.post = post;
      activity.space = post.space;
      activity.spacePrev = spacePrevInst;
      activity.aggregated = true;
      activity.aggCount = BigInt(0);
    }
  }

  /**
   * PostShared
   */
  if (eventNameDecorated === EventName.PostShared && post) {
    activity.post = post;
    activity.space = post.space;
  }

  /**
   * SpaceCreated
   * SpaceUpdated
   * SpaceFollowed
   * SpaceUnfollowed
   */
  if (
    (eventNameDecorated === EventName.SpaceCreated ||
      eventNameDecorated === EventName.SpaceUpdated ||
      eventNameDecorated === EventName.SpaceFollowed ||
      eventNameDecorated === EventName.SpaceUnfollowed) &&
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
    } else {
      activity.space = spaceInst;

      if (eventNameDecorated === EventName.SpaceCreated) {
        activity.aggregated = true;
        activity.aggCount = BigInt(0);
      }

      if (
        eventNameDecorated === EventName.SpaceFollowed ||
        eventNameDecorated === EventName.SpaceUnfollowed
      ) {
        activity.aggregated = true;
        activity.aggCount = BigInt(
          !spaceInst.followersCount ? 0 : spaceInst.followersCount - 1
        );
      }
    }
  }

  /**
   * PostReactionCreated
   * PostReactionUpdated
   * PostReactionDeleted
   */
  if (
    (eventNameDecorated === EventName.PostReactionCreated ||
      eventNameDecorated === EventName.PostReactionDeleted ||
      eventNameDecorated === EventName.PostReactionUpdated) &&
    post &&
    reaction
  ) {
    if (eventNameDecorated !== EventName.PostReactionDeleted)
      activity.reaction = reaction;
    activity.post = post;
    activity.space = post.rootPost ? post.rootPost.space : post.space;

    const upvotesCount = !post.upvotesCount ? 0 : post.upvotesCount;
    const downvotesCount = !post.downvotesCount ? 0 : post.downvotesCount;

    activity.aggregated = true;
    activity.aggCount = BigInt(upvotesCount + downvotesCount - 1);
  }

  await ctx.store.save<Activity>(activity);

  return activity;
};
