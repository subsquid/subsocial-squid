import BN from 'bn.js';
import { resolveSpace, resolveSpaceStruct } from './resolvers/resolveSpaceData';
import {
  getDateWithoutTime,
  addressSs58ToString,
  printEventLog
} from './utils';
import { SpaceDataExtended } from '../common/types';
import { Account, Space } from '../model';
import {
  SpacesSpaceCreatedEvent,
  SpacesSpaceUpdatedEvent
} from '../types/events';
import { ensureAccount } from './account';
import { setActivity } from './activity';
import { processSpaceFollowingUnfollowingRelations } from './space-follows';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../common/errors';
import { EventHandlerContext } from '../common/contexts';

export async function spaceCreated(ctx: EventHandlerContext) {
  const event = new SpacesSpaceCreatedEvent(ctx);
  printEventLog(ctx);

  const [accountId, id] = event.asV1;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  if (!account) {
    new EntityProvideFailWarning(Account, addressSs58ToString(accountId), ctx);
    return;
  }

  const space = await ensureSpace({ space: id.toString(), ctx });

  if (!space || !('id' in space)) {
    new EntityProvideFailWarning(Space, id.toString(), ctx);
    return;
  }
  await ctx.store.save<Space>(space);

  await processSpaceFollowingUnfollowingRelations(account, space, ctx);

  await setActivity({
    account,
    space,
    ctx
  });
}

export async function spaceUpdated(ctx: EventHandlerContext) {
  const event = new SpacesSpaceUpdatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, spaceId] = event.asV1;

  const spaceExtData = await ensureSpace({
    space: spaceId.toString(),
    ctx,
    isExtendedData: true
  });

  if (
    !spaceExtData ||
    !('struct' in spaceExtData) ||
    !('content' in spaceExtData)
  ) {
    new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
    return;
  }

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
// TODO refactor "ensureSpace" implementation
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
    space instanceof Space
      ? space
      : await ctx.store.get(Space, {
          where: { id: space },
          relations: ['createdByAccount', 'ownerAccount']
        });

  if (spaceInst && !isExtendedData) return spaceInst;
  if (spaceInst && isExtendedData) {
    const spaceDataSSApi = await resolveSpace(new BN(spaceInst.id, 10));
    if (!spaceDataSSApi) {
      new MissingSubsocialApiEntity('SpaceData', ctx);
      return null;
    }
    return {
      struct: spaceDataSSApi.struct,
      content: spaceDataSSApi.content,
      space: spaceInst
    };
  }
  const spaceId = space instanceof Space ? space.id : space;

  const spaceDataSSApi = await resolveSpace(new BN(spaceId, 10));
  if (!spaceDataSSApi) {
    new MissingSubsocialApiEntity('SpaceData', ctx);
    return null;
  }

  const { struct: spaceStruct, content: spaceContent } = spaceDataSSApi;

  if (!spaceInst) {
    spaceInst = new Space();
    spaceInst.id = spaceId.toString();

    const createdByAccount = await ensureAccount(
      spaceStruct.createdByAccount,
      ctx
    );
    if (!createdByAccount) {
      new EntityProvideFailWarning(Account, spaceStruct.createdByAccount, ctx);
      return null;
    }

    spaceInst.createdByAccount = createdByAccount;
    spaceInst.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString());
    spaceInst.createdAtTime = new Date(spaceStruct.createdAtTime);
    spaceInst.createdOnDay = getDateWithoutTime(
      new Date(spaceStruct.createdAtTime)
    );
  }
  const ownerAccount = await ensureAccount(spaceStruct.ownerId, ctx);
  if (!ownerAccount) {
    new EntityProvideFailWarning(Account, spaceStruct.ownerId, ctx);
    return null;
  }

  spaceInst.ownerAccount = ownerAccount;
  spaceInst.content = spaceStruct.contentId;

  spaceInst.postsCount = spaceStruct.postsCount; // TODO Refactoring is required
  spaceInst.hiddenPostsCount = spaceStruct.hiddenPostsCount; // TODO Refactoring is required
  spaceInst.publicPostsCount =
    spaceInst.postsCount - spaceInst.hiddenPostsCount; // TODO Refactoring is required
  spaceInst.followersCount = spaceStruct.followersCount; // TODO Refactoring is required
  // spaceInst.score = spaceStruct.score;

  if (spaceContent) {
    spaceInst.name = spaceContent.name;
    spaceInst.summary = spaceContent.about;
    spaceInst.image = spaceContent.image;
    spaceInst.tagsOriginal = spaceContent.tags?.join(',');
  }

  if (createIfNotExists) await ctx.store.save<Space>(spaceInst);

  if (isExtendedData)
    return {
      struct: spaceStruct,
      content: spaceContent,
      space: spaceInst
    };
  return spaceInst;
};

// TODO counters must be refactored
export async function updateCountersInSpace(
  ctx: EventHandlerContext,
  space: Space
): Promise<void> {
  const spaceChanged: Space = space;
  if (!space) return;

  // const spaceStruct = await resolveSpaceStruct(
  //   new BN(spaceChanged.id.toString(), 10)
  // );
  // if (!spaceStruct) {
  //   new MissingSubsocialApiEntity('SpaceStruct', ctx);
  //   return;
  // }
  //
  // spaceChanged.postsCount = spaceStruct.postsCount;
  // spaceChanged.hiddenPostsCount = spaceStruct.hiddenPostsCount;
  // spaceChanged.publicPostsCount =
  //   spaceChanged.postsCount - spaceChanged.hiddenPostsCount;
  //
  // await ctx.store.save<Space>(spaceChanged);
}
