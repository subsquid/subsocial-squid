import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account, Activity, Space, SpaceFollowers } from '../model';
import {
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent
} from '../types/events';
import {
  addressSs58ToString,
  getSpaceFollowersEntityId,
  printEventLog
} from './utils';
import { ensureAccount } from './account';
import { setActivity } from './activity';
import { deleteSpacePostsFromFeedForAccount } from './news-feed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutSpace
} from './notification';
import { EntityProvideFailWarning } from '../common/errors';
import { EventAction } from '../common/types';

export async function spaceFollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [followerId, spaceId] = event.asV1;
  await handleEvent(addressSs58ToString(followerId), spaceId.toString(), ctx);
}

export async function spaceUnfollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);

  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  const [followerId, spaceId] = event.asV1;

  await handleEvent(addressSs58ToString(followerId), spaceId.toString(), ctx);
}

async function handleEvent(
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
): Promise<void> {
  const { method } = ctx.event;
  const followerAccount = await ensureAccount(followerId, ctx, true);

  if (!followerAccount) {
    new EntityProvideFailWarning(Account, followerId, ctx);
    return;
  }

  const space = await ctx.store.get(Space, {
    where: { id: spaceId },
    relations: ['ownerAccount']
  });
  if (!space) {
    new EntityProvideFailWarning(Space, spaceId, ctx);
    return;
  }

  await processSpaceFollowingUnfollowingRelations(followerAccount, space, ctx);

  const activity = await setActivity({
    account: followerAccount,
    ctx,
    space
  });
  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }

  if (method === EventAction.SpaceFollowed) {
    await addNotificationForAccount(space.ownerAccount, activity, ctx);
  } else if (method === EventAction.SpaceUnfollowed) {
    await deleteSpacePostsFromFeedForAccount(activity.account, space, ctx);
    await deleteAllNotificationsAboutSpace(followerAccount, space, ctx);
  }
}

async function processSpaceFollowingUnfollowingRelations(
  follower: Account | string,
  space: Space,
  ctx: EventHandlerContext
): Promise<void> {
  if (!space) return;
  const followerAccountInst =
    follower instanceof Account ? follower : await ensureAccount(follower, ctx);
  if (!followerAccountInst) return;

  const { method } = ctx.event;
  const paceFollowersEntityId = getSpaceFollowersEntityId(
    followerAccountInst.id,
    space.id
  );

  const spaceFollowers = await ctx.store.get(
    SpaceFollowers,
    paceFollowersEntityId
  );

  let currentSpaceFollowersCount = space.followersCount || 0;

  if (method === EventAction.SpaceFollowed) {
    if (spaceFollowers) return;
    currentSpaceFollowersCount += 1;

    const newSpaceFollowersEnt = new SpaceFollowers();

    newSpaceFollowersEnt.id = paceFollowersEntityId;
    newSpaceFollowersEnt.followerAccount = followerAccountInst;
    newSpaceFollowersEnt.followingSpace = space;

    await ctx.store.save<SpaceFollowers>(newSpaceFollowersEnt);
  } else if (method === EventAction.SpaceUnfollowed) {
    if (!spaceFollowers) return;
    currentSpaceFollowersCount -= 1;
    await ctx.store.remove<SpaceFollowers>(spaceFollowers);
  }

  space.followersCount = currentSpaceFollowersCount;

  await ctx.store.save<Space>(space);
}
