import { Ctx, Block } from '../processor';
import {
  DomainsDomainByInnerValueStorage,
  SpacesSpaceByIdStorage
} from '../types/generated/storage';
import { SpaceData, AnyId } from '@subsocial/types/dto';
import { Space } from '@subsocial/definitions/interfaces';

import { UnknownVersionError } from '../common/errors';
import { flattenSpaceStruct } from '@subsocial/api/subsocial/flatteners';
import * as v13 from '../types/generated/v13';
import { addressSs58ToString, batchCaller } from '../common/utils';
import { resolveSubsocialApi } from '../connection/subsocial';
import { resolveSpaceIPFSContentByCid } from '../connection/resolvers/resolveSpaceData';
import * as v7 from '../types/generated/v7';
import { IpfsCid, IpfsCommonContent } from '@subsocial/api/types/ipfs';
import { ContentResult } from '@subsocial/api/types';

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

export async function resolveSpacesDataNative(
  idOrList: bigint | bigint[],
  ctx: Ctx,
  block: Block
): Promise<Array<SpaceData | null>> {
  const spaceRawDataList = await getStorageDataSpaceById(idOrList, ctx, block);

  // console.log('spaceRawDataList - ');
  // console.dir(spaceRawDataList, { depth: null });

  if (!spaceRawDataList) return Promise.resolve([]);

  const ipfsContent = await resolveSpaceIPFSContentByCid(
    (Array.isArray(spaceRawDataList) ? spaceRawDataList : [spaceRawDataList])
      .filter((i) => !!i)
      // @ts-ignore
      .map((spaceData) => {
        // @ts-ignore
        // console.log('spaceData!.content.value - ', spaceData!.content.value.toString())
        // @ts-ignore
        return spaceData!.content.value.toString();
      })
  );

  console.dir(ipfsContent, { depth: null });

  // TODO fetch content from Subsocial API by method api.ipfs.getContentArrayFromIpfs(cids)

  return Promise.resolve([]);
}

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

export async function resolveSpacesHandleStorage(
  idOrList: [Uint8Array, v7.InnerValue] | [Uint8Array, v7.InnerValue][],
  ctx: Ctx,
  block: Block
): Promise<(Uint8Array | undefined)[] | Uint8Array | undefined> {
  const storage = new DomainsDomainByInnerValueStorage(ctx, block.header);
  if (!storage.isExists) return undefined;

  if (storage.isV7) {
    if (Array.isArray(idOrList)) {
      return await storage.getManyAsV7(
        idOrList as [Uint8Array, v7.InnerValue][]
      );
    } else {
      return await storage.getAsV7(idOrList[0], idOrList[1]);
    }
  } else {
    throw new UnknownVersionError(storage.constructor.name);
  }
}

export async function resolveSpacesContentIPFS<T>(
  spaceCids: [string, IpfsCid][]
): Promise<Map<string, T> | undefined> {
  try {
    const resMap = new Map();
    let tmpRes: ContentResult<T> = {};

    await batchCaller({
      srcList: spaceCids.map((p) => p[1]),
      batchSize: 500,
      timeout: 7000,
      handler: async (cidsBatch) => {
        // @ts-ignore
        tmpRes = {
          ...tmpRes,
          ...(await resolveSpaceIPFSContentByCid(cidsBatch))
        };
        await new Promise((res) => setTimeout(res, 2000));
        // console.log('FETCH FINISH ', Date.now());
      }
    });

    for (const [spaceId, cid] of spaceCids) {
      resMap.set(spaceId, tmpRes[cid.toString()] ?? undefined);
    }

    return resMap;
  } catch (e) {
    return undefined;
  }
}
