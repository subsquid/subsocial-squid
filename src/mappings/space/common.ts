import BN from 'bn.js';
import { resolveSpace } from '../../connection/resolvers/resolveSpaceData';
import {
  ensurePositiveOrZeroValue,
  getDateWithoutTime
} from '../../common/utils';
import { SpaceCountersAction } from '../../common/types';
import { Space, Post } from '../../model';
import { ensureAccount } from '../account';
import {
  CommonCriticalError,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

/**
 * Provides Space data. Merges data from Squid DB and Subsocial API. If Space entity is not existing in Squid DB, new
 * Space instance will be created.
 * @param space
 * @param ctx
 * @param createIfNotExists
 */
export const ensureSpace = async ({
  space,
  ctx,
  createIfNotExists = false
}: {
  space: Space | string;
  ctx: EventHandlerContext;
  createIfNotExists?: boolean;
}): Promise<Space | null> => {
  let spaceInst =
    space instanceof Space
      ? space
      : await ctx.store.get(Space, {
          where: { id: space },
          relations: { createdByAccount: true, ownerAccount: true }
        });

  if (spaceInst) return spaceInst;
  const spaceId = space instanceof Space ? space.id : space;

  const spaceDataSSApi = await resolveSpace(new BN(spaceId, 10));

  if (!spaceDataSSApi) {
    new MissingSubsocialApiEntity('SpaceData', ctx);
    new CommonCriticalError();
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

    spaceInst.createdByAccount = createdByAccount;
    spaceInst.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString());
    spaceInst.createdAtTime = new Date(spaceStruct.createdAtTime);
    spaceInst.createdOnDay = getDateWithoutTime(
      new Date(spaceStruct.createdAtTime)
    );
    spaceInst.hidden = spaceStruct.hidden;
  }
  const ownerAccount = await ensureAccount(spaceStruct.ownerId, ctx);

  spaceInst.ownerAccount = ownerAccount;
  spaceInst.content = spaceStruct.contentId;

  spaceInst.postsCount = 0; // Initial value for counter
  spaceInst.hiddenPostsCount = 0; // Initial value for counter
  spaceInst.publicPostsCount = 0; // Initial value for counter
  spaceInst.followersCount = 0; // Initial value for counter

  if (spaceContent) {
    spaceInst.name = spaceContent.name;
    spaceInst.email = spaceContent.email;
    spaceInst.about = spaceContent.about;
    spaceInst.summary = spaceContent.summary;
    spaceInst.image = spaceContent.image;
    spaceInst.tagsOriginal = (spaceContent.tags || []).join(',');
    spaceInst.linksOriginal = (spaceContent.links || []).join(',');
  }

  if (createIfNotExists) await ctx.store.save<Space>(spaceInst);

  return spaceInst;
};

export async function updatePostsCountersInSpace({
  space,
  post,
  isPrevVisStateHidden = false,
  action,
  ctx
}: {
  space: Space | null;
  post: Post;
  isPrevVisStateHidden?: boolean;
  action: SpaceCountersAction;
  ctx: EventHandlerContext;
}): Promise<void> {
  if (!space) return;

  const spaceChanged: Space = space;
  if (!space) return;
  if (post.isComment) return;

  let { publicPostsCount = 0, postsCount = 0, hiddenPostsCount = 0 } = space;

  switch (action) {
    case SpaceCountersAction.PostAdded:
      postsCount += 1;
      if (post.hidden) {
        hiddenPostsCount += 1;
      } else {
        publicPostsCount += 1;
      }
      spaceChanged.postsCount = postsCount;
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
    case SpaceCountersAction.PostUpdated:
      if (post.hidden && post.hidden !== isPrevVisStateHidden) {
        hiddenPostsCount += 1;
        publicPostsCount = ensurePositiveOrZeroValue(publicPostsCount - 1);
      } else if (!post.hidden && post.hidden !== isPrevVisStateHidden) {
        publicPostsCount += 1;
        hiddenPostsCount = ensurePositiveOrZeroValue(hiddenPostsCount - 1);
      }
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
    case SpaceCountersAction.PostDeleted:
      postsCount = ensurePositiveOrZeroValue(postsCount - 1);
      if (post.hidden) {
        hiddenPostsCount = ensurePositiveOrZeroValue(hiddenPostsCount - 1);
      } else {
        publicPostsCount = ensurePositiveOrZeroValue(publicPostsCount - 1);
      }
      spaceChanged.postsCount = postsCount;
      spaceChanged.hiddenPostsCount = hiddenPostsCount;
      spaceChanged.publicPostsCount = publicPostsCount;
      break;
  }

  await ctx.store.save<Space>(spaceChanged);
}
