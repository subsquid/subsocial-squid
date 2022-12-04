import { SubstrateBlock } from '@subsquid/substrate-processor';
import { Block, Ctx } from '../processor';
import { EventName } from '../model';
import {
  resolveSpacesData,
  resolveSpacesHandleStorage,
  resolveSpacesContentIPFS
} from './space';
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

export class StorageDataManager {
  private static instance: StorageDataManager;

  public idsForFetch: Map<
    StorageSection,
    Map<
      BlochHash,
      Set<
        [EntityId, string | null] | [Uint8Array, v7.InnerValue, string | null]
      >
    >
  > = new Map();

  public storageDataCache: Map<
    StorageSection,
    Map<BlochHash, Map<EntityId, SpaceStorageData | PostStorageData>>
  > = new Map([
    ['space', new Map()],
    ['post', new Map()]
  ]);

  private constructor(private context: Ctx) {}

  static getInstance(ctx: Ctx): StorageDataManager {
    if (!StorageDataManager.instance) {
      StorageDataManager.instance = new StorageDataManager(ctx);
    }
    return StorageDataManager.instance;
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
    if (!this.idsForFetch.has(section))
      this.idsForFetch.set(section, new Map());
    if (!this.idsForFetch.get(section)!.has(blockHash))
      this.idsForFetch.get(section)!.set(blockHash, new Set());
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

            this.idsForFetch
              .get('space')!
              .get(event.blockHash)!
              .add([
                addressStringToSs58(event.accountId),
                { __kind: 'Space', value: BigInt(event.spaceId) },
                event.ipfsSrc
              ]);
          }
          break;
        }
        case EventName.PostCreated:
        case EventName.PostUpdated: {
          for (const event of [...eventsData.values()] as (PostCreatedData &
            PostUpdatedData)[]) {
            this.ensureIdsForFetchContainer('post', event.blockHash);

            this.idsForFetch
              .get('post')!
              .get(event.blockHash)!
              .add([event.postId, event.ipfsSrc]);
          }
          break;
        }

        default:
      }
    }

    for (const [section, idsListByBlock] of [...this.idsForFetch.entries()]) {
      switch (section) {
        case 'space': {
          for (const [blockHash, idsPairs] of [...idsListByBlock.entries()]) {
            const idPairsList = [...idsPairs.values()] as [
              Uint8Array,
              v7.InnerValue,
              string | null
            ][];
            const spacesHandlesResp = await resolveSpacesHandleStorage(
              idPairsList.map((d) => {
                return [d[0], d[1]] as [Uint8Array, v7.InnerValue];
              }),
              this.context,
              // @ts-ignore
              { header: { hash: blockHash } }
            );

            const spacesIpfsIpfsResp =
              await resolveSpacesContentIPFS<IpfsSpaceContentSummarized>(
                idPairsList
                  .filter((d) => d[2] !== null)
                  .map((d) => {
                    return [d[1].value.toString(), d[2]!];
                  })
              );

            this.ensureStorageDataCacheContainer(section, blockHash);

            for (let i = 0; i < idPairsList.length; i++) {
              const spaceIdStr = idPairsList[i][1].value.toString();
              const spaceStorageData: SpaceStorageData = {
                ipfsContent: null,
                handle: null
              };

              if (spacesHandlesResp && spacesHandlesResp[i])
                spaceStorageData.handle = spacesHandlesResp[i]
                  ? spacesHandlesResp[i]!.toString()
                  : null;

              if (spacesIpfsIpfsResp && spacesIpfsIpfsResp.has(spaceIdStr))
                spaceStorageData.ipfsContent =
                  spacesIpfsIpfsResp.get(spaceIdStr) ?? null;

              this.storageDataCache
                .get(section)!
                .get(blockHash)!
                .set(spaceIdStr, spaceStorageData);
            }
          }

          break;
        }
        case 'post': {
          for (const [blockHash, idsPairs] of [...idsListByBlock.entries()]) {
            const idPairsList = [...idsPairs.values()];

            const postsIpfsResp =
              await resolveSpacesContentIPFS<IpfsPostContentSummarized>(
                // @ts-ignore
                idPairsList.filter((d) => d[1] !== null)
              );

            this.ensureStorageDataCacheContainer(section, blockHash);

            for (let i = 0; i < idPairsList.length; i++) {
              const postId = idPairsList[i][0].toString();
              const postStorageData: PostStorageData = {
                ipfsContent: null
              };

              if (postsIpfsResp && postsIpfsResp.has(postId))
                postStorageData.ipfsContent = postsIpfsResp.get(postId) ?? null;

              this.storageDataCache
                .get(section)!
                .get(blockHash)!
                .set(postId, postStorageData);
            }
          }
          break;
        }
        default:
      }
    }
    this.idsForFetch.clear();
  }
}

// public idsForFetch: Map<Block, Map<string, Set<string>>> = new Map();
// public storageDataCache: Map<Block, Map<string, unknown>> = new Map();
// export async function initialProcessingEntitiesStorageData(
//   parsedEvents: ParsedEventsDataScope,
//   ctx: Ctx
// ) {
//   const idsForFetch = new Map<Block, Map<string, Set<string>>>();
//   const storageDataCache = new Map<Block, Map<string, unknown>>();
//   for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
//     switch (eventName) {
//       case EventName.SpaceCreated:
//       case EventName.SpaceUpdated: {
//         for (const event of [...eventsData.values()]) {
//           if (!idsForFetch.has(event.block))
//             idsForFetch.set(event.block, new Map());
//           if (!idsForFetch.get(event.block)!.has('space'))
//             idsForFetch.get(event.block)!.set('space', new Set());
//           // @ts-ignore
//           idsForFetch.get(event.block)!.get('space')!.add(event.spaceId);
//         }
//         break;
//       }
//       default:
//     }
//   }
//
//   for (const [block, val] of [...idsForFetch.entries()]) {
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
