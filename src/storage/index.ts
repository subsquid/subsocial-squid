import { Ctx } from '../processor';
import { EventName } from '../model';
import { resolveSpacesHandleStorage } from './space';
import { ParsedEventsDataScope } from '../eventsCallsData';

import {
  SpaceStorageData,
  PostStorageData,
  SpaceCreatedData,
  SpaceUpdatedData,
} from '../common/types';
import * as v7 from '../types/generated/v7';
import { addressStringToSs58 } from '../common/utils';
import { IpfsDataManager } from '../ipfs';
import {
  StorageSection,
  BlochHash,
  EntityId,
  StorageData,
  IpfsContent
} from './types';

export class StorageDataManager {
  private static instance: StorageDataManager;

  public idsForFetchStorage: Map<
    StorageSection,
    Map<BlochHash, Set<[EntityId, string | null] | [Uint8Array, v7.InnerValue]>>
  > = new Map();

  public storageDataCache: Map<
    StorageSection,
    Map<BlochHash, Map<EntityId, SpaceStorageData | PostStorageData>>
  > = new Map([
    ['space', new Map()],
    ['post', new Map()]
  ]);

  private ipfsDataManager: IpfsDataManager;

  private constructor(private context: Ctx) {
    this.ipfsDataManager = IpfsDataManager.getInstance(context);
  }

  static getInstance(ctx: Ctx): StorageDataManager {
    if (!StorageDataManager.instance) {
      StorageDataManager.instance = new StorageDataManager(ctx);
    }
    return StorageDataManager.instance;
  }

  purgeStorage() {
    this.storageDataCache.clear();
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

  public async fetchIpfsContentByCid<T extends StorageSection>(
    section: T,
    cid: string | null
  ): Promise<IpfsContent<T> | null> {
    if (!cid) return null;
    const res = await this.ipfsDataManager.fetchOneByIdHttp(cid);
    if (!res) return null;
    return res as IpfsContent<T>;
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

    this.idsForFetchStorage.clear();
  }
}
