import { SubstrateBlock } from '@subsquid/substrate-processor';
import { Block, Ctx } from '../processor';
import { EventName } from '../model';
import { resolveSpacesData, resolveSpacesHandleStorage } from './space';
import { resolvePostsData } from './post';
import { ParsedEventsDataScope } from '../common/eventsData';
import { SpaceData, PostWithAllDetails } from '@subsocial/types/dto';
import { decodeHex } from '@subsquid/substrate-processor';

import {
  SpaceStorageData,
  PostStorageData,
  PostCreatedData,
  SpaceCreatedData,
  SpaceUpdatedData,
  PostUpdatedData,
  IpfsPostContentSummarized,
  IpfsSpaceContentSummarized
} from '../common/types';
import * as v7 from '../types/generated/v7';
import { addressStringToSs58 } from '../common/utils';
import { IpfsDataManager } from './ipfsClient';

type StorageSection = 'space' | 'post';
type BlochHash = string;
type EntityId = string;
type EntityIdRaw = bigint;

type StorageDataMap<T> = Map<EntityId, StorageData<T>>;
type StorageData<T> = T extends 'space'
  ? SpaceStorageData
  : T extends 'post'
  ? PostStorageData
  : never;

type IpfsContent<T> = T extends 'space'
  ? IpfsSpaceContentSummarized
  : T extends 'post'
  ? IpfsPostContentSummarized
  : never;

export class StorageDataManager {
  private static instance: StorageDataManager;

  public idsForFetchStorage: Map<
    StorageSection,
    Map<BlochHash, Set<[EntityId, string | null] | [Uint8Array, v7.InnerValue]>>
  > = new Map();

  private idsForFetchIpfs: Set<string> = new Set();

  public storageDataCache: Map<
    StorageSection,
    Map<BlochHash, Map<EntityId, SpaceStorageData | PostStorageData>>
  > = new Map([
    ['space', new Map()],
    ['post', new Map()]
  ]);

  private ipfsDataManager: IpfsDataManager;

  private constructor(private context: Ctx) {
    this.ipfsDataManager = IpfsDataManager.getInstance();
  }

  static getInstance(ctx: Ctx): StorageDataManager {
    if (!StorageDataManager.instance) {
      StorageDataManager.instance = new StorageDataManager(ctx);
    }
    return StorageDataManager.instance;
  }

  get ipfsContentAll() {
    return this.ipfsDataManager.contentMap;
  }

  purgeStorage() {
    this.storageDataCache.clear();
    this.ipfsDataManager.purgeStorage();
  }

  // public getStorageData(
  //   section: StorageSection
  // ): Map<string, SpaceData | PostWithDetails> {
  //   return (
  //     this.storageDataCache.get(section) ||
  //     new Map<string, SpaceData | PostWithDetails>()
  //   );
  // }

  public getStorageDataForSection<T extends StorageSection>(
    section: T
  ): Map<BlochHash, StorageDataMap<T>> {
    return (
      (this.storageDataCache.get(section) as Map<
        BlochHash,
        StorageDataMap<T>
      >) || new Map<BlochHash, Map<EntityId, StorageDataMap<T>>>()
    );
  }
  public getStorageDataById<T extends StorageSection>(
    section: T,
    blockHash: string,
    entityId: EntityId
  ): StorageData<T> | undefined {
    this.ensureStorageDataCacheContainer(section, blockHash);
    return this.storageDataCache.get(section)!.get(blockHash)!.get(entityId) as
      | StorageData<T>
      | undefined;
  }

  public getIpfsContentByCid<T extends StorageSection>(
    section: T,
    cid: string | null
  ): IpfsContent<T> | null {
    if (!cid) return null;
    return this.ipfsDataManager.getContent(cid) as IpfsContent<T>;
  }

  public async fetchIpfsContentByCid<T extends StorageSection>(
    section: T,
    cid: string | null
  ): Promise<IpfsContent<T> | null> {
    if (!cid) return null;
    const res = await this.ipfsDataManager.fetchOneByIdHttp(cid);
    if (!res) return null;
    return res as IpfsContent<T>;
  }

  public getStorageDataItemsForBlock<T extends StorageSection>(
    section: T,
    blockHash: string
  ): StorageDataMap<T> {
    this.ensureStorageDataCacheContainer(section, blockHash);
    return this.storageDataCache
      .get(section as T)!
      .get(blockHash)! as StorageDataMap<T>;
  }

  private ensureIdsForFetchContainer(
    section: StorageSection,
    blockHash: string
  ) {
    if (!this.idsForFetchStorage.has(section))
      this.idsForFetchStorage.set(section, new Map());
    if (!this.idsForFetchStorage.get(section)!.has(blockHash))
      this.idsForFetchStorage.get(section)!.set(blockHash, new Set());
  }
  private ensureStorageDataCacheContainer(
    section: StorageSection,
    blockHash: string
  ) {
    if (!this.storageDataCache.has(section))
      this.storageDataCache.set(section, new Map());
    if (!this.storageDataCache.get(section)!.has(blockHash))
      this.storageDataCache.get(section)!.set(blockHash, new Map());
  }

  async fetchStorageDataByEventsData(
    parsedEvents: ParsedEventsDataScope
  ): Promise<void> {
    for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
      switch (eventName) {
        case EventName.SpaceCreated:
        case EventName.SpaceUpdated: {
          for (const event of [...eventsData.values()] as (SpaceCreatedData &
            SpaceUpdatedData)[]) {
            this.ensureIdsForFetchContainer('space', event.blockHash);

            this.idsForFetchStorage
              .get('space')!
              .get(event.blockHash)!
              .add([
                addressStringToSs58(event.accountId),
                { __kind: 'Space', value: BigInt(event.spaceId) }
              ]);

            if (event.ipfsSrc) this.idsForFetchIpfs.add(event.ipfsSrc);
          }
          break;
        }
        case EventName.PostCreated:
        case EventName.PostUpdated: {
          for (const event of [...eventsData.values()] as (PostCreatedData &
            PostUpdatedData)[]) {
            // this.ensureIdsForFetchContainer('post', event.blockHash);

            // this.idsForFetchStorage
            //   .get('post')!
            //   .get(event.blockHash)!
            //   .add([event.postId, event.ipfsSrc]);
            if (event.ipfsSrc) this.idsForFetchIpfs.add(event.ipfsSrc);
          }
          break;
        }

        default:
      }
    }

    for (const [section, idsListByBlock] of [
      ...this.idsForFetchStorage.entries()
    ]) {
      switch (section) {
        case 'space': {
          for (const [blockHash, idsPairs] of [...idsListByBlock.entries()]) {
            const idPairsList = [...idsPairs.values()] as [
              Uint8Array,
              v7.InnerValue
            ][];
            const spacesHandlesResp = await resolveSpacesHandleStorage(
              idPairsList.map((d) => {
                return [d[0], d[1]] as [Uint8Array, v7.InnerValue];
              }),
              this.context,
              // @ts-ignore
              { header: { hash: blockHash } }
            );

            this.ensureStorageDataCacheContainer(section, blockHash);

            for (let i = 0; i < idPairsList.length; i++) {
              const spaceIdStr = idPairsList[i][1].value.toString();
              const spaceStorageData: SpaceStorageData = {
                handle: null
              };

              if (spacesHandlesResp && spacesHandlesResp[i])
                spaceStorageData.handle = spacesHandlesResp[i]
                  ? spacesHandlesResp[i]!.toString()
                  : null;

              this.storageDataCache
                .get(section)!
                .get(blockHash)!
                .set(spaceIdStr, spaceStorageData);
            }
          }

          break;
        }
        default:
      }
    }

    // console.dir(this.idsForFetchIpfs, { depth: null });
    // await this.ipfsDataManager.fetchManyByCids([
    //   ...(this.idsForFetchIpfs.values() || [])
    // ]);
    this.idsForFetchStorage.clear();
    this.idsForFetchIpfs.clear();
  }
}

// public idsForFetchStorage: Map<Block, Map<string, Set<string>>> = new Map();
// public storageDataCache: Map<Block, Map<string, unknown>> = new Map();
// export async function initialProcessingEntitiesStorageData(
//   parsedEvents: ParsedEventsDataScope,
//   ctx: Ctx
// ) {
//   const idsForFetchStorage = new Map<Block, Map<string, Set<string>>>();
//   const storageDataCache = new Map<Block, Map<string, unknown>>();
//   for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
//     switch (eventName) {
//       case EventName.SpaceCreated:
//       case EventName.SpaceUpdated: {
//         for (const event of [...eventsData.values()]) {
//           if (!idsForFetchStorage.has(event.block))
//             idsForFetchStorage.set(event.block, new Map());
//           if (!idsForFetchStorage.get(event.block)!.has('space'))
//             idsForFetchStorage.get(event.block)!.set('space', new Set());
//           // @ts-ignore
//           idsForFetchStorage.get(event.block)!.get('space')!.add(event.spaceId);
//         }
//         break;
//       }
//       default:
//     }
//   }
//
//   for (const [block, val] of [...idsForFetchStorage.entries()]) {
//     for (const [section, idsList] of [...val.entries()]) {
//       switch (section) {
//         case 'space': {
//           console.log('[...idsList.values()] - ', [...idsList.values()]);
//           console.log('[...idsList.values()] - ', idsList.size);
//           const storageResp = await resolveSpacesData(
//             [...idsList.values()],
//             ctx,
//             block
//           );
//           if (storageResp !== null) storageDataCache.set(block, storageResp);
//           break;
//         }
//         default:
//       }
//     }
//   }
// }
