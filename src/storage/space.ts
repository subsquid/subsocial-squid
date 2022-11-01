import { Ctx, Block } from '../processor';
import { SpacesSpaceByIdStorage } from '../types/generated/storage';
import { SpaceData, AnyId } from '@subsocial/types/dto';
import { Space } from '@subsocial/definitions/interfaces';

import { UnknownVersionError } from '../common/errors';
import { flattenSpaceStruct } from '@subsocial/api/subsocial/flatteners';
import * as v13 from '../types/generated/v13';
import { addressSs58ToString } from '../common/utils';
import { resolveSubsocialApi } from '../connection/subsocial';

interface SpaceStructDecorated {
  id: string;
  createdByAccount: string;
  createdAtBlock: number;
  createdAtTime: number;
}

function decorateSpaceStorageData(rawData: v13.Space): SpaceStructDecorated {
  const decoratedData = { ...rawData };

  if (!decoratedData.permissions) {
    // @ts-ignore
    decoratedData.permissions = null;
  } else {
    for (const permSection in decoratedData.permissions) {
      if (
        decoratedData.permissions[permSection as keyof v13.SpacePermissions] !==
        undefined
      ) {
        const decoratedPermissions = [];
        for (const pItem of decoratedData.permissions[
          permSection as keyof v13.SpacePermissions
        ]!) {
          decoratedPermissions.push(pItem.__kind);
        }
        // @ts-ignore
        decoratedData.permissions[permSection as keyof v13.SpacePermissions] =
          decoratedPermissions;
      }
    }
  }
  // @ts-ignore
  return flattenSpaceStruct(decoratedData as Space);
}

async function getStorageDataSpaceById(
  idOrList: bigint | bigint[],
  ctx: Ctx,
  block: Block
): Promise<v13.Space | (v13.Space | undefined)[] | undefined> {
  const storage = new SpacesSpaceByIdStorage(ctx, block.header);
  if (!storage.isExists) return undefined;

  if (storage.isV13) {
    if (Array.isArray(idOrList)) {
      return await storage.getManyAsV13(idOrList);
    } else {
      return await storage.getAsV13(idOrList);
    }
  } else {
    throw new UnknownVersionError(storage.constructor.name);
  }
}

// export async function resolveSpaceData(
//   id: string,
//   ctx: Ctx,
//   block: Block
// ): Promise<SpaceData | null> {
//   const spaceRawData = await getStorageDataSpaceById(BigInt(id), ctx, block);
//
//   return null;
// }
export async function resolveSpacesData(
  ids: string[]
  // ctx: Ctx,
  // block: Block
): Promise<Map<string, SpaceData> | null> {
  const api = await resolveSubsocialApi();
  const spacesData = new Map<string, SpaceData>(
    (await api.findSpaceStructs(ids as AnyId[])).map((structItem) => [
      structItem.id,
      {
        id: structItem.id,
        struct: structItem,
        content: undefined
      } as SpaceData
    ])
  );
  const contentIds = new Map<string, string>(); // Map<cid, structId>

  spacesData.forEach((data, id) => {
    if (data.struct.contentId) contentIds.set(data.struct.contentId, data.id);
  });

  const contentData = await api.ipfs.getContentArrayFromIpfs([
    ...contentIds.keys()
  ]);

  for (const cid in contentData) {
    if (!contentIds.has(cid)) continue;
    const structId = contentIds.get(cid)!;
    console.dir(
      {
        ...spacesData.get(structId),
        // @ts-ignore
        content: contentData[cid]
      },
      { depth: null }
    );
    spacesData.set(structId, {
      ...spacesData.get(structId),
      // @ts-ignore
      content: contentData[cid]
    });
  }

  return spacesData;

  // const spaceRawDataList = await getStorageDataSpaceById(
  //   ids.map((id) => BigInt(id)),
  //   ctx,
  //   block
  // );
  // if (spaceRawDataList === undefined || !Array.isArray(spaceRawDataList))
  //   return null;
  // const spaceStructList = spaceRawDataList
  //   .filter((i) => i !== undefined)
  //   // @ts-ignore
  //   .map((resp) => decorateSpaceStorageData(resp));
  //
  // console.log('spaceStructList');
  // console.dir(spaceStructList, { depth: null });
  // return null;
}
