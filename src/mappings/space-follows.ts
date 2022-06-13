import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { Space, SpaceFollowers } from '../model';
import {
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent
} from '../types/events';
import { EventAction, addressSs58ToString } from './utils';
import { ensureAccount } from './account';
import { setActivity } from './activity';

export async function spaceFollowed(ctx: EventHandlerContext) {
  console.log(':::::::::::::::::::: spaceFollowed :::::::::::::::::::::::');
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [followerId, id] = event.asV1;
  const accountIdString = addressSs58ToString(followerId);

  const space = await processSpaceFollowingUnfollowing(
    addressSs58ToString(followerId),
    id.toString(),
    ctx
  );
  if (!space) return;
  await setActivity({
    account: accountIdString,
    ctx,
    space
  });
}

export async function spaceUnfollowed(ctx: EventHandlerContext) {
  console.log(':::::::::::::::::::: spaceUnfollowed :::::::::::::::::::::::');

  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  const [followerId, id] = event.asV1;
  const accountIdString = addressSs58ToString(followerId);

  const space = await processSpaceFollowingUnfollowing(
    accountIdString,
    id.toString(),
    ctx
  );
  if (!space) return;
  await setActivity({
    account: accountIdString,
    ctx,
    space
  });
}

const processSpaceFollowingUnfollowing = async (
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
): Promise<Space | null> => {
  const { method } = ctx.event;
  console.log('---method - ', method);

  const spaceFollowers = await ctx.store.get(SpaceFollowers, {
    where: { followerAccount: followerId, followingSpace: spaceId }
  });

  const space = await ctx.store.get(Space, spaceId);
  if (!space) return null;
  let currentSpaceFollowersCount = space.followersCount || 0;

  if (method === EventAction.SpaceFollowed) {
    if (spaceFollowers) return null;
    currentSpaceFollowersCount += 1;

    const newSpaceFollowersEnt = new SpaceFollowers();

    const followerAccount = await ensureAccount(followerId, ctx, true);
    if (!followerAccount) return null;

    newSpaceFollowersEnt.id = `${followerAccount.id}-${space.id}`;
    newSpaceFollowersEnt.followerAccount = followerAccount;
    newSpaceFollowersEnt.followingSpace = space;

    await ctx.store.save<SpaceFollowers>(newSpaceFollowersEnt);
    console.log(1);
  } else if (method === EventAction.SpaceUnfollowed) {
    if (!spaceFollowers) return null;
    currentSpaceFollowersCount -= 1;
    await ctx.store.remove<SpaceFollowers>(spaceFollowers);
    console.log(2);
  }

  // const spaceStruct = await resolveSpaceStruct(new BN(spaceId.toString(), 10));
  // if (!spaceStruct) return;

  space.followersCount = currentSpaceFollowersCount;

  return ctx.store.save<Space>(space);
};
