import BN from 'bn.js';
import { u8aToString } from '@polkadot/util';
import { resolveSpace, resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { getDateWithoutTime, SpaceDataExtended } from './utils';
import { Space } from '../model';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import {
  SpacesSpaceCreatedEvent,
  SpacesSpaceUpdatedEvent
} from '../types/events';
import { ensureAccount } from './account';

export async function spaceCreated(ctx: EventHandlerContext) {
  console.log(':::::::::::::::::::: spaceCreated ::::::::::::::::::::::::');

  await createSpace(ctx);
}

export async function spaceUpdated(ctx: EventHandlerContext) {
  console.log(':::::::::::::::::::: spaceUpdated :::::::::::::::::::::::');

  const event = new SpacesSpaceUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const spaceExtData = await ensureSpace(accountId, id, ctx, true);

  if (
    !spaceExtData ||
    !('struct' in spaceExtData) ||
    !('content' in spaceExtData)
  )
    return;

  const { space, struct: spaceStruct } = spaceExtData;

  if (!spaceStruct) return;

  if (
    spaceStruct.updatedAtTime &&
    space.updatedAtTime === new Date(spaceStruct.updatedAtTime)
  )
    return;

  space.updatedAtTime = spaceStruct.updatedAtTime
    ? new Date(spaceStruct.updatedAtTime)
    : null;

  await ctx.store.save<Space>(space);
  console.log(`////////// Space ${id.toString()} has been updated //////////`);
}

const createSpace = async (ctx: EventHandlerContext) => {
  const event = new SpacesSpaceCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const space = await ensureSpace(accountId, id, ctx);

  if (space && 'id' in space) {
    await ctx.store.save<Space>(space);
    console.log(
      `////////// Space ${id.toString()} has been created //////////`
    );
  }
};

/**
 * Provides Space data. Merges data from Squid DB and Subsocial API. If Space entity is not existing in Squid DB, new
 * Space instance will be created.
 * @param accountId
 * @param id
 * @param ctx
 * @param isExtendedData
 */
export const ensureSpace = async (
  accountId: Uint8Array,
  id: bigint,
  ctx: EventHandlerContext,
  isExtendedData?: boolean
): Promise<Space | SpaceDataExtended | null> => {
  const spaceData = await resolveSpace(new BN(id.toString(), 10));

  if (!spaceData) return null;

  const { struct: spaceStruct, content: spaceContent } = spaceData;

  let space = await ctx.store.get(Space, id.toString());

  if (!space) {
    space = new Space();
    space.id = id.toString();

    const createdByAccount = await ensureAccount(
      spaceStruct.createdByAccount,
      ctx,
      true
    );
    if (!createdByAccount) return null;

    space.createdByAccount = createdByAccount;
    space.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString());
    space.createdAtTime = new Date(spaceStruct.createdAtTime);
    space.createdOnDay = getDateWithoutTime(
      new Date(spaceStruct.createdAtTime)
    );
  }
  const ownerAccount = await ensureAccount(spaceStruct.ownerId, ctx, true);
  if (!ownerAccount) return null;

  space.ownerAccount = ownerAccount;
  space.content = spaceStruct.contentId;

  space.postsCount = spaceStruct.postsCount;
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount;
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount;
  space.followersCount = spaceStruct.followersCount;
  space.score = spaceStruct.score;

  if (spaceContent) {
    space.name = spaceContent.name;
    space.summary = spaceContent.about;
    space.image = spaceContent.image;
    space.tagsOriginal = spaceContent.tags?.join(',');
  }

  if (isExtendedData)
    return {
      struct: spaceStruct,
      content: spaceContent,
      space
    };
  return space;
};

export async function updateCountersInSpace(store: Store, space: Space) {
  console.log('updateCountersInSpace');
  const spaceUpdated: Space = space;
  if (!space) return;

  const spaceStruct = await resolveSpaceStruct(
    new BN(spaceUpdated.id.toString(), 10)
  );
  if (!spaceStruct) return;

  spaceUpdated.postsCount = spaceStruct.postsCount;
  spaceUpdated.hiddenPostsCount = spaceStruct.hiddenPostsCount;
  spaceUpdated.publicPostsCount =
    spaceUpdated.postsCount - spaceUpdated.hiddenPostsCount;

  await store.save<Space>(spaceUpdated);
}
