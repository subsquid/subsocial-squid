import BN from 'bn.js';
import { resolveSpace } from '../../connection/resolvers/resolveSpaceData';
import { getDateWithoutTime } from '../../common/utils';
import { SpaceCountersAction, SpaceDataExtended } from '../../common/types';
import { Account, Space, Post } from '../../model';
import { ensureAccount } from '../account';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

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

  spaceInst.postsCount = 0; // Initial value for counter
  spaceInst.hiddenPostsCount = 0; // Initial value for counter
  spaceInst.publicPostsCount = 0; // Initial value for counter
  // spaceInst.followersCount = spaceStruct.followersCount;
  spaceInst.followersCount = 0; // Initial value for counter
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
export async function updatePostsCountersInSpace({
  space,
  post,
  isPrevVisStateHidden = false,
  action,
  ctx
}: {
  space: Space;
  post: Post;
  isPrevVisStateHidden?: boolean;
  action: SpaceCountersAction;
  ctx: EventHandlerContext;
}): Promise<void> {
  const spaceChanged: Space = space;
  if (!space) return;

  let { publicPostsCount = 0, postsCount = 0, hiddenPostsCount = 0 } = space;

  switch (action) {
    case SpaceCountersAction.PostAdded:
      postsCount = !postsCount ? 1 : postsCount + 1;
      if (post.hidden) {
        hiddenPostsCount = !hiddenPostsCount ? 1 : hiddenPostsCount + 1;
      } else {
        publicPostsCount = !publicPostsCount ? 1 : publicPostsCount + 1;
      }
      spaceChanged.postsCount = postsCount;
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
    case SpaceCountersAction.PostUpdated:
      if (post.hidden && post.hidden !== isPrevVisStateHidden) {
        hiddenPostsCount = !hiddenPostsCount ? 1 : hiddenPostsCount + 1;
        publicPostsCount = !publicPostsCount ? 0 : publicPostsCount - 1;
      } else if (!post.hidden && post.hidden !== isPrevVisStateHidden) {
        publicPostsCount = !publicPostsCount ? 1 : publicPostsCount + 1;
        hiddenPostsCount = !hiddenPostsCount ? 0 : hiddenPostsCount - 1;
      }
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
    case SpaceCountersAction.PostDeleted:
      postsCount = !postsCount ? 0 : postsCount - 1;
      if (post.hidden) {
        hiddenPostsCount = !hiddenPostsCount ? 0 : hiddenPostsCount - 1;
      } else {
        publicPostsCount = !publicPostsCount ? 0 : publicPostsCount - 1;
      }
      spaceChanged.postsCount = postsCount;
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
  }

  await ctx.store.save<Space>(spaceChanged);
}
