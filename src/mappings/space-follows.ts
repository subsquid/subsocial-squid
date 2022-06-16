import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Account, Space, SpaceFollowers } from '../model';
import {
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent
} from '../types/events';
import {
  EventAction,
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

export async function spaceFollowed(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [followerId, id] = event.asV1;
  await handleEvent(addressSs58ToString(followerId), id.toString(), ctx);
}

export async function spaceUnfollowed(ctx: EventHandlerContext) {
  printEventLog(ctx);

  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  const [followerId, id] = event.asV1;

  await handleEvent(addressSs58ToString(followerId), id.toString(), ctx);
}

async function handleEvent(
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
) {
  const { method } = ctx.event;
  const followerAccount = await ensureAccount(followerId, ctx, true);

  if (!followerAccount) return;

  const space = await processSpaceFollowingUnfollowingRelations(
    followerAccount,
    spaceId,
    ctx
  );
  if (!space) return;
  const activity = await setActivity({
    account: followerAccount,
    ctx,
    space
  });
  if (!activity) return;

  if (method === EventAction.SpaceFollowed) {
    await addNotificationForAccount(space.ownerAccount, activity, ctx);
  } else if (method === EventAction.SpaceUnfollowed) {
    await deleteSpacePostsFromFeedForAccount(activity.account, space, ctx);
    await deleteAllNotificationsAboutSpace(followerAccount, space, ctx);
  }
}

async function processSpaceFollowingUnfollowingRelations(
  follower: Account | string,
  spaceId: string,
  ctx: EventHandlerContext
): Promise<Space | null> {
  const followerAccountInst =
    follower instanceof Account ? follower : await ensureAccount(follower, ctx);
  if (!followerAccountInst) return null;

  const { method } = ctx.event;

  const spaceFollowers = await ctx.store.get(
    SpaceFollowers,
    getSpaceFollowersEntityId(followerAccountInst.id, spaceId)
  );

  const space = await ctx.store.get(Space, spaceId);
  if (!space) return null;
  let currentSpaceFollowersCount = space.followersCount || 0;

  if (method === EventAction.SpaceFollowed) {
    if (spaceFollowers) return null;
    currentSpaceFollowersCount += 1;

    const newSpaceFollowersEnt = new SpaceFollowers();

    newSpaceFollowersEnt.id = getSpaceFollowersEntityId(
      followerAccountInst.id,
      spaceId
    );
    newSpaceFollowersEnt.followerAccount = followerAccountInst;
    newSpaceFollowersEnt.followingSpace = space;

    await ctx.store.save<SpaceFollowers>(newSpaceFollowersEnt);
  } else if (method === EventAction.SpaceUnfollowed) {
    if (!spaceFollowers) return null;
    currentSpaceFollowersCount -= 1;
    await ctx.store.remove<SpaceFollowers>(spaceFollowers);
  }

  space.followersCount = currentSpaceFollowersCount;

  return ctx.store.save<Space>(space);
}
