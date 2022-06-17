import BN from 'bn.js';
import { resolveSpace, resolveSpaceStruct } from './resolvers/resolveSpaceData';
import {
  getDateWithoutTime,
  addressSs58ToString,
  SpaceDataExtended,
  printEventLog
} from './utils';
import { Account, Space } from '../model';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import {
  SpacesSpaceCreatedEvent,
  SpacesSpaceUpdatedEvent
} from '../types/events';
import { ensureAccount } from './account';
import { setActivity } from './activity';

export async function spaceCreated(ctx: EventHandlerContext) {
  const event = new SpacesSpaceCreatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const space = await ensureSpace({ space: id.toString(), ctx });

  if (space && 'id' in space) {
    await ctx.store.save<Space>(space);
    await setActivity({
      account: addressSs58ToString(accountId),
      space,
      ctx
    });
  }
}

export async function spaceUpdated(ctx: EventHandlerContext) {
  const event = new SpacesSpaceUpdatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const spaceExtData = await ensureSpace({
    space: id.toString(),
    ctx,
    isExtendedData: true
  });

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
  await setActivity({
    account: addressSs58ToString(accountId),
    space,
    ctx
  });
}

/**
 * Provides Space data. Merges data from Squid DB and Subsocial API. If Space entity is not existing in Squid DB, new
 * Space instance will be created.
 * @param space
 * @param ctx
 * @param isExtendedData
 * @param createIfNotExists
 */
export const ensureSpace = async ({
  space,
  ctx,
  isExtendedData = false,
  createIfNotExists = false
}: {
  space: Space | string;
  ctx: EventHandlerContext;
  isExtendedData?: boolean;
  createIfNotExists?: boolean;
}): Promise<Space | SpaceDataExtended | null> => {
  let spaceInst =
    space instanceof Space ? space : await ctx.store.get(Space, space);
  const spaceId = space instanceof Space ? space.id : space;

  const spaceDataSSApi = await resolveSpace(new BN(spaceId, 10));
  if (!spaceDataSSApi) return null;

  const { struct: spaceStruct, content: spaceContent } = spaceDataSSApi;

  if (!spaceInst) {
    spaceInst = new Space();
    spaceInst.id = spaceId.toString();

    const createdByAccount = await ensureAccount(
      spaceStruct.createdByAccount,
      ctx,
      true
    );
    if (!createdByAccount) return null;

    spaceInst.createdByAccount = createdByAccount;
    spaceInst.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString());
    spaceInst.createdAtTime = new Date(spaceStruct.createdAtTime);
    spaceInst.createdOnDay = getDateWithoutTime(
      new Date(spaceStruct.createdAtTime)
    );
  }
  const ownerAccount = await ensureAccount(spaceStruct.ownerId, ctx, true);
  if (!ownerAccount) return null;

  spaceInst.ownerAccount = ownerAccount;
  spaceInst.content = spaceStruct.contentId;

  spaceInst.postsCount = spaceStruct.postsCount;
  spaceInst.hiddenPostsCount = spaceStruct.hiddenPostsCount;
  spaceInst.publicPostsCount =
    spaceInst.postsCount - spaceInst.hiddenPostsCount;
  spaceInst.followersCount = spaceStruct.followersCount;
  spaceInst.score = spaceStruct.score;

  if (spaceContent) {
    spaceInst.name = spaceContent.name;
    spaceInst.summary = spaceContent.about;
    spaceInst.image = spaceContent.image;
    spaceInst.tagsOriginal = spaceContent.tags?.join(',');
  }

  if (createIfNotExists) spaceInst = await ctx.store.save<Space>(spaceInst);

  if (isExtendedData)
    return {
      struct: spaceStruct,
      content: spaceContent,
      space: spaceInst
    };
  return spaceInst;
};

export async function updateCountersInSpace(
  store: Store,
  space: Space
): Promise<void> {
  const spaceChanged: Space = space;
  if (!space) return;

  const spaceStruct = await resolveSpaceStruct(
    new BN(spaceChanged.id.toString(), 10)
  );
  if (!spaceStruct) return;

  spaceChanged.postsCount = spaceStruct.postsCount;
  spaceChanged.hiddenPostsCount = spaceStruct.hiddenPostsCount;
  spaceChanged.publicPostsCount =
    spaceChanged.postsCount - spaceChanged.hiddenPostsCount;

  await store.save<Space>(spaceChanged);
}
