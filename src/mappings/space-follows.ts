import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import BN from 'bn.js';
import { Space } from '../model';
import {
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent
} from '../types/events';
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';

export async function spaceFollowed(ctx: EventHandlerContext) {
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [followerId, id] = event.asV1;

  await spaceFollowedOrUnfollowed(followerId.toString(), id.toString(), ctx);
}

export async function spaceUnfollowed(ctx: EventHandlerContext) {
  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  const [followerId, id] = event.asV1;

  await spaceFollowedOrUnfollowed(followerId.toString(), id.toString(), ctx);
}

const spaceFollowedOrUnfollowed = async (
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
) => {
  const space = await ctx.store.get(Space, spaceId);
  if (!space) return;

  const spaceStruct = await resolveSpaceStruct(new BN(spaceId.toString(), 10));
  if (!spaceStruct) return;

  space.followersCount = spaceStruct.followersCount;

  await ctx.store.save<Space>(space);
};
