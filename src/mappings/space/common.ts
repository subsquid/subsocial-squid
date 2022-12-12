import {
  ensurePositiveOrZeroValue,
  getDateWithoutTime
} from '../../common/utils';
import {
  SpaceCountersAction,
  SpaceCreatedData,
  SpacePermissionsScope
} from '../../common/types';
import { Post, Space, SpacePermissions } from '../../model';
import { getOrCreateAccount } from '../account';
import {
  CommonCriticalError,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { Ctx } from '../../processor';
import { StorageDataManager } from '../../storage';

/**
 * Provides Space data. Merges data from Squid DB and Subsocial API. If Space entity is not existing in Squid DB, new
 * Space instance will be created.
 * @param space
 * @param ctx
 * @param createIfNotExists
 */

export const ensureSpace = async ({
  spaceId,
  ctx,
  eventData
}: {
  spaceId: string;
  ctx: Ctx;
  eventData: SpaceCreatedData;
}): Promise<Space> => {
  const storageDataManagerInst = StorageDataManager.getInstance(ctx);
  const spaceStorageData = storageDataManagerInst.getStorageDataById(
    'space',
    eventData.blockHash,
    spaceId
  );

  if (!spaceStorageData) {
    new MissingSubsocialApiEntity('SpaceData', ctx, eventData);
    throw new CommonCriticalError();
  }

  const spaceIpfsContent = await storageDataManagerInst.fetchIpfsContentByCid(
    'space',
    eventData.ipfsSrc
  );

  const spaceInst = new Space();

  const signerAccountInst = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    '3339cb5e-bd1d-4b2d-8d9d-c74bff054745'
  );

  if (eventData.forced && eventData.forcedData) {
    spaceInst.hidden = eventData.forcedData.hidden;
    spaceInst.ownedByAccount = await getOrCreateAccount(
      eventData.forcedData.owner,
      ctx,
      'b83c251b-8e62-4f4e-9a7b-632fabca46df'
    );
    spaceInst.createdByAccount = await getOrCreateAccount(
      eventData.forcedData.account,
      ctx,
      '530b6d19-918b-4397-93aa-3bbc8e533314'
    );
    spaceInst.createdAtBlock = BigInt(eventData.forcedData.block.toString());
    spaceInst.createdAtTime = eventData.forcedData.time;
    spaceInst.createdOnDay = getDateWithoutTime(eventData.forcedData.time);
  } else {
    spaceInst.hidden = false;
    spaceInst.ownedByAccount = signerAccountInst;
    spaceInst.createdByAccount = signerAccountInst;
    spaceInst.createdAtBlock = BigInt(eventData.blockNumber.toString());
    spaceInst.createdAtTime = eventData.timestamp;
    spaceInst.createdOnDay = getDateWithoutTime(eventData.timestamp);
  }

  spaceInst.id = spaceId;
  spaceInst.content = eventData.ipfsSrc;
  spaceInst.handle = spaceStorageData.handle;

  spaceInst.postsCount = 0; // Initial value for counter
  spaceInst.hiddenPostsCount = 0; // Initial value for counter
  spaceInst.publicPostsCount = 0; // Initial value for counter
  spaceInst.followersCount = 0; // Initial value for counter

  spaceInst.canFollowerCreatePosts = eventData.permissions.follower.CreatePosts;
  spaceInst.canEveryoneCreatePosts = eventData.permissions.everyone.CreatePosts;

  spaceInst.nonePermissions = getSpacePermissions(eventData.permissions);
  spaceInst.everyonePermissions = getSpacePermissions(eventData.permissions);
  spaceInst.followerPermissions = getSpacePermissions(eventData.permissions);
  spaceInst.spaceOwnerPermissions = getSpacePermissions(eventData.permissions);

  if (spaceIpfsContent) {
    spaceInst.name = spaceIpfsContent.name ?? null;
    spaceInst.email = spaceIpfsContent.email ?? null;
    spaceInst.about = spaceIpfsContent.about ?? null;
    spaceInst.summary = spaceIpfsContent.summary ?? null;
    spaceInst.image = spaceIpfsContent.image ?? null;
    spaceInst.tagsOriginal = spaceIpfsContent.tags
      ? (spaceIpfsContent.tags || []).join(',')
      : null;
    spaceInst.linksOriginal = spaceIpfsContent.links
      ? (spaceIpfsContent.links || []).join(',')
      : null;
  }

  return spaceInst;
};

function getSpacePermissions(
  spacePermissions: SpacePermissionsScope
): SpacePermissions | null {
  const newPermissionsScope = new SpacePermissions();

  for (const permKey in spacePermissions) {
    const permKeyDecorated = (permKey.charAt(0).toLowerCase() +
      permKey.slice(1)) as keyof SpacePermissions;

    if (permKeyDecorated in newPermissionsScope)
      //@ts-ignore
      newPermissionsScope[permKeyDecorated] =
        spacePermissions[permKey as keyof SpacePermissionsScope];
  }

  return newPermissionsScope;
}

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
  ctx: Ctx;
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

  await ctx.store.save(spaceChanged);
}
