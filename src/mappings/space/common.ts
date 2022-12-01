import BN from 'bn.js';
import {
  resolveSpace,
  resolveSpaceHandle
} from '../../connection/resolvers/resolveSpaceData';
import {
  ensurePositiveOrZeroValue,
  getDateWithoutTime
} from '../../common/utils';
import {
  EventData,
  SpaceCountersAction,
  SpaceCreatedData,
  // SpacePermissionRoot,
  SpacePermissionsScope
} from '../../common/types';
import { Post, Space, SpacePermissions } from '../../model';
import { ensureAccount } from '../account';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { SpaceStruct } from '@subsocial/types/dto';
import { FlatSpacePermissionMap } from '@subsocial/types/substrate/rpc';
import { Ctx } from '../../processor';
import { StorageDataManager } from '../../storage/storageDataManager';

/**
 * Provides Space data. Merges data from Squid DB and Subsocial API. If Space entity is not existing in Squid DB, new
 * Space instance will be created.
 * @param space
 * @param ctx
 * @param createIfNotExists
 */
// export const ensureSpace = async ({
//   space,
//   signerAccountId,
//   ctx,
//   createIfNotExists = false
// }: {
//   space: Space | string;
//   signerAccountId: string;
//   ctx: EventHandlerContext;
//   createIfNotExists?: boolean;
// }): Promise<Space | null> => {
//   let spaceInst =
//     space instanceof Space
//       ? space
//       : await ctx.store.get(Space, {
//           where: { id: space },
//           relations: { ownedByAccount: true }
//         });
//
//   if (spaceInst) return spaceInst;
//   const spaceId = space instanceof Space ? space.id : space;
//
//   const spaceDataSSApi = await resolveSpace(new BN(spaceId, 10));
//
//   if (!spaceDataSSApi) {
//     new MissingSubsocialApiEntity('SpaceData', ctx);
//     new CommonCriticalError();
//     return null;
//   }
//
//   const { struct: spaceStruct, content: spaceContent } = spaceDataSSApi;
//   const spaceHandle =
//     (await resolveSpaceHandle(new BN(spaceId, 10), spaceStruct.ownerId)) ??
//     null;
//
//   if (!spaceInst) {
//     spaceInst = new Space();
//     spaceInst.id = spaceId.toString();
//
//     const createdByAccount = await ensureAccount(
//       spaceStruct.createdByAccount,
//       ctx
//     );
//
//     spaceInst.createdByAccount = createdByAccount;
//     spaceInst.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString());
//     spaceInst.createdAtTime = new Date(spaceStruct.createdAtTime);
//     spaceInst.createdOnDay = getDateWithoutTime(
//       new Date(spaceStruct.createdAtTime)
//     );
//     spaceInst.hidden = spaceStruct.hidden;
//   }
//   const ownerAccount = await ensureAccount(spaceStruct.ownerId, ctx);
//
//   spaceInst.ownedByAccount = ownerAccount;
//   spaceInst.content = spaceStruct.contentId;
//   spaceInst.handle = spaceHandle;
//
//   spaceInst.postsCount = 0; // Initial value for counter
//   spaceInst.hiddenPostsCount = 0; // Initial value for counter
//   spaceInst.publicPostsCount = 0; // Initial value for counter
//   spaceInst.followersCount = 0; // Initial value for counter
//
//   spaceInst.canFollowerCreatePosts = spaceStruct.canFollowerCreatePosts;
//   spaceInst.canEveryoneCreatePosts = spaceStruct.canEveryoneCreatePosts;
//
//   spaceInst.nonePermissions = getSpacePermissions(
//     SpacePermissionRoot.none,
//     spaceStruct
//   );
//   spaceInst.everyonePermissions = getSpacePermissions(
//     SpacePermissionRoot.everyone,
//     spaceStruct
//   );
//   spaceInst.followerPermissions = getSpacePermissions(
//     SpacePermissionRoot.follower,
//     spaceStruct
//   );
//   spaceInst.spaceOwnerPermissions = getSpacePermissions(
//     SpacePermissionRoot.spaceOwner,
//     spaceStruct
//   );
//
//   if (spaceContent) {
//     spaceInst.name = spaceContent.name;
//     spaceInst.email = spaceContent.email;
//     spaceInst.about = spaceContent.about;
//     spaceInst.summary = spaceContent.summary;
//     spaceInst.image = spaceContent.image;
//     spaceInst.tagsOriginal = (spaceContent.tags || []).join(',');
//     spaceInst.linksOriginal = (spaceContent.links || []).join(',');
//   }
//
//   if (createIfNotExists) await ctx.store.save<Space>(spaceInst);
//
//   return spaceInst;
// };

export const ensureSpace = async ({
  spaceId,
  ctx,
  eventData
}: {
  spaceId: string;
  ctx: Ctx;
  eventData: SpaceCreatedData;
}): Promise<Space> => {
  const spaceStorageData = StorageDataManager.getInstance(
    ctx
  ).getStorageDataById('space', eventData.blockHash, spaceId);

  if (!spaceStorageData) {
    new MissingSubsocialApiEntity('SpaceData', ctx, eventData);
    throw new CommonCriticalError();
  }

  const spaceInst = new Space();
  spaceInst.id = spaceId;

  const createdByAccount = await ensureAccount(eventData.accountId, ctx);

  spaceInst.createdByAccount = createdByAccount;
  spaceInst.createdAtBlock = BigInt(eventData.blockNumber.toString());
  spaceInst.createdAtTime = new Date(eventData.timestamp);
  spaceInst.createdOnDay = getDateWithoutTime(new Date(eventData.timestamp));
  spaceInst.hidden = false;

  spaceInst.ownedByAccount = createdByAccount;
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

  if (spaceStorageData.ipfsContent) {
    spaceInst.name = spaceStorageData.ipfsContent.name;
    spaceInst.email = spaceStorageData.ipfsContent.email;
    spaceInst.about = spaceStorageData.ipfsContent.about;
    spaceInst.summary = spaceStorageData.ipfsContent.summary;
    spaceInst.image = spaceStorageData.ipfsContent.image;
    spaceInst.tagsOriginal = (spaceStorageData.ipfsContent.tags || []).join(
      ','
    );
    spaceInst.linksOriginal = (spaceStorageData.ipfsContent.links || []).join(
      ','
    );
  }

  ctx.store.deferredUpsert(spaceInst);

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
