import { Reaction, Space } from '../../model';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { Ctx } from '../../processor';
import { SpaceUpdatedData } from '../../common/types';
import { StorageDataManager } from '../../storage/storageDataManager';
import { setActivity } from '../activity';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

export async function spaceUpdated(
  ctx: Ctx,
  eventData: SpaceUpdatedData
): Promise<void> {
  const space = await getEntityWithRelations.space(eventData.spaceId, ctx);

  if (!space) {
    new EntityProvideFailWarning(Space, eventData.spaceId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const storageDataManagerInst = StorageDataManager.getInstance(ctx);
  const spaceStorageData = storageDataManagerInst.getStorageDataById(
    'space',
    eventData.blockHash,
    eventData.spaceId
  );

  if (!spaceStorageData) {
    new MissingSubsocialApiEntity('SpaceData', ctx, eventData);
    throw new CommonCriticalError();
  }

  const spaceIpfsContent = await storageDataManagerInst.fetchIpfsContentByCid(
    'space',
    eventData.ipfsSrc
  );

  space.updatedAtTime = eventData.timestamp;

  space.updatedAtBlock = BigInt(eventData.blockNumber);

  if (spaceIpfsContent) {
    space.handle = spaceStorageData.handle;
    space.name = spaceIpfsContent.name ?? null;
    space.email = spaceIpfsContent.email ?? null;
    space.about = spaceIpfsContent.about ?? null;
    space.summary = spaceIpfsContent.summary ?? null;
    space.image = spaceIpfsContent.image ?? null;
    space.tagsOriginal = spaceIpfsContent.tags
      ? (spaceIpfsContent.tags || []).join(',')
      : null;
    space.linksOriginal = spaceIpfsContent.links
      ? (spaceIpfsContent.links || []).join(',')
      : null;
  }

  await ctx.store.save(space);

  await setActivity({
    account: eventData.accountId,
    space,
    ctx,
    eventData
  });
}
//
// export async function spaceUpdated(ctx: EventHandlerContext): Promise<void> {
//   const event = new SpacesSpaceUpdatedEvent(ctx);
//   printEventLog(ctx);
//
//   const { account: accountId, spaceId } = event.asV13;
//
//   const space = await ensureSpace({
//     space: spaceId.toString(),
//     ctx
//   });
//
//   if (!space) {
//     new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
//     throw new CommonCriticalError();
//   }
//
//   const spaceDataSSApi = await resolveSpace(new BN(spaceId.toString(), 10));
//   if (!spaceDataSSApi) {
//     new MissingSubsocialApiEntity('SpaceData', ctx);
//     throw new CommonCriticalError();
//   }
//
//   const { struct: spaceStruct, content: spaceContent } = spaceDataSSApi;
//
//   if (
//     spaceStruct.updatedAtTime &&
//     space.updatedAtTime === new Date(spaceStruct.updatedAtTime)
//   )
//     return;
//
//   space.updatedAtTime = spaceStruct.updatedAtTime
//     ? new Date(spaceStruct.updatedAtTime)
//     : null;
//   space.updatedAtBlock = spaceStruct.updatedAtBlock
//     ? BigInt(spaceStruct.updatedAtBlock)
//     : BigInt(ctx.block.height.toString());
//
//   if (spaceContent) {
//     space.name = spaceContent.name;
//     space.email = spaceContent.email;
//     space.about = spaceContent.about;
//     space.summary = spaceContent.summary;
//     space.image = spaceContent.image;
//     space.tagsOriginal = (spaceContent.tags || []).join(',');
//     space.linksOriginal = (spaceContent.links || []).join(',');
//   }
//
//   await ctx.store.save<Space>(space);
//
//   await setActivity({
//     account: addressSs58ToString(accountId),
//     space,
//     ctx
//   });
// }
