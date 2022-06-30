import { Account, Space, Post, Activity, Reaction } from '../model';
import { EventName } from '../common/types';
import { getActivityEntityId, decorateEventName } from './utils';
import { EventHandlerContext } from '../common/contexts';
import { insertActivityForPostCreated } from './activityUtils/insertActivityForPostCreated';
import { insertActivityForPostMoved } from './activityUtils/insertActivityForPostMoved';
import { insertActivityForPostShared } from './activityUtils/insertActivityForPostShared';
import { insertActivityForSpaceCreatedUpdated } from './activityUtils/insertActivityForSpaceCreatedUpdated';
import { insertActivityForSpaceFollowedUnfollowed } from './activityUtils/insertActivityForSpaceFollowedUnfollowed';
import { insertActivityForPostReaction } from './activityUtils/insertActivityForPostReaction';
import { insertActivityForAccountFollowedUnfollowed } from './activityUtils/insertActivityForAccountFollowedUnfollowed';
import { ensureAccount } from './account';
import { EntityProvideFailWarning } from '../common/errors';

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
  space?: Space;
  spacePrev?: Space;
  post?: Post;
  reaction?: Reaction;
  followingAccount?: Account;
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

  let activity = new Activity();
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
    activity = await insertActivityForAccountFollowedUnfollowed({
      eventName: eventNameDecorated,
      followingAccount,
      activity,
      ctx
    });
  }
  /**
   * PostCreated
   */
  if (eventNameDecorated === EventName.PostCreated && post)
    activity = await insertActivityForPostCreated({
      eventName: eventNameDecorated,
      post,
      activity,
      ctx
    });

  /**
   * PostMoved
   */
  if (eventNameDecorated === EventName.PostMoved && post && spacePrev) {
    activity = await insertActivityForPostMoved({
      eventName: eventNameDecorated,
      post,
      spacePrev,
      activity,
      ctx
    });
  }

  /**
   * PostShared
   */
  if (eventNameDecorated === EventName.PostShared && post) {
    activity = await insertActivityForPostShared({
      eventName: eventNameDecorated,
      post,
      activity,
      ctx
    });
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
    activity = await insertActivityForPostReaction({
      eventName: eventNameDecorated,
      post,
      reaction,
      activity,
      ctx
    });
  }

  /**
   * SpaceCreated
   * SpaceUpdated
   */
  if (
    (eventNameDecorated === EventName.SpaceCreated ||
      eventNameDecorated === EventName.SpaceUpdated) &&
    space
  ) {
    activity = await insertActivityForSpaceCreatedUpdated({
      eventName: eventNameDecorated,
      space,
      activity,
      ctx
    });
  }

  /**
   * SpaceFollowed
   * SpaceUnfollowed
   */
  if (
    (eventNameDecorated === EventName.SpaceFollowed ||
      eventNameDecorated === EventName.SpaceUnfollowed) &&
    space
  ) {
    activity = await insertActivityForSpaceFollowedUnfollowed({
      eventName: eventNameDecorated,
      space,
      activity,
      ctx
    });
  }
  await ctx.store.save<Activity>(activity);
  return activity;
};
