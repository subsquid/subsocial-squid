import { Block, Ctx } from '../processor';
import { EventName } from '../model';
import { resolveSpacesData } from './space';
import { resolvePostsData } from './post';
import { ParsedEventsDataScope } from '../common/eventsData';
import { SpaceData, PostWithAllDetails } from '@subsocial/types/dto';
import { PostWithDetails } from '../common/types';

type StorageSection = 'space' | 'post';

export class StorageDataManager {
  private static instance: StorageDataManager;
  public idsForFetch: Map<StorageSection, Set<string>> = new Map();
  public storageDataCache: Map<
    StorageSection,
    Map<string, SpaceData | PostWithDetails>
  > = new Map([
    ['post', new Map()],
    ['space', new Map()]
  ]);

  private constructor(private context: Ctx) {}

  public getStorageData(
    section: StorageSection
  ): Map<string, SpaceData | PostWithDetails> {
    return (
      this.storageDataCache.get(section) ||
      new Map<string, SpaceData | PostWithDetails>()
    );
  }

  static getInstance(ctx: Ctx): StorageDataManager {
    if (!StorageDataManager.instance) {
      StorageDataManager.instance = new StorageDataManager(ctx);
    }
    return StorageDataManager.instance;
  }

  async fetchStorageDataByEventsData(
    parsedEvents: ParsedEventsDataScope
  ): Promise<void> {
    for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
      switch (eventName) {
        case EventName.SpaceCreated:
        case EventName.SpaceUpdated: {
          for (const event of [...eventsData.values()]) {
            if (!this.idsForFetch.has('space'))
              this.idsForFetch.set('space', new Set());
            // @ts-ignore
            this.idsForFetch.get('space')!.add(event.spaceId);
          }
          break;
        }
        case EventName.PostCreated:
        case EventName.PostUpdated: {
          for (const event of [...eventsData.values()]) {
            if (!this.idsForFetch.has('post'))
              this.idsForFetch.set('post', new Set());
            // @ts-ignore
            this.idsForFetch.get('post')!.add(event.spaceId);
          }
          break;
        }
        default:
      }
    }

    for (const [section, idsList] of [...this.idsForFetch.entries()]) {
      switch (section) {
        case 'space': {
          const storageResp = await resolveSpacesData([...idsList.values()]);
          if (storageResp !== null)
            this.storageDataCache.set(section, storageResp);
          break;
        }
        case 'post': {
          const storageResp = await resolvePostsData([...idsList.values()]);
          if (storageResp !== null)
            this.storageDataCache.set(section, storageResp);
          break;
        }
        default:
      }
    }
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
