import {
  EventName,
  ReactionKind,
  PostKind,
  Post,
  Account,
  Space,
  Reaction
} from '../model';
import { Block, Ctx, EventItem } from '../processor';
import {
  ParsedEventsData,
  ParsedEventsDataMap,
  PostWithDetails,
  PostCreatedData,
  PostUpdatedData,
  EventId,
  EventContext,
  EventData
} from './types';
import argsParsers from './argsParsers';
import { StorageDataManager } from '../storage/storageDataManager';
import {
  SubstrateBlock,
  SubstrateEvent,
  EventHandlerContext,
  SubstrateBatchProcessor
} from '@subsquid/substrate-processor';

export class ParsedEventsDataScope {
  private scope: ParsedEventsDataMap;

  constructor() {
    this.scope = new Map();
  }

  set(section: EventName, value: ParsedEventsData): void {
    this.scope.set(
      section,
      (this.scope.get(section) || new Map()).set(value.id, value)
    );
  }

  get<T>(section: EventName): Map<EventId, T> {
    return (
      (this.scope.get(section) as Map<EventId, T>) || new Map<EventId, T>()
    );
  }

  getSectionByEventName<T>(section: EventName): Map<EventId, T> {
    return (
      (this.scope.get(section) as Map<EventId, T>) || new Map<EventId, T>()
    );
  }

  entries(): IterableIterator<[EventName, Map<EventId, ParsedEventsData>]> {
    return this.scope.entries();
  }
}

function getEventMetadata(block: Block, event: SubstrateEvent): EventData {
  return {
    id: event.id,
    indexInBlock: event.indexInBlock,
    name: event.name,
    blockNumber: block.header.height,
    blockHash: block.header.hash,
    timestamp: new Date(block.header.timestamp)
  };
}

export function getParsedEventsData(ctx: Ctx): ParsedEventsDataScope {
  const parsedData = new ParsedEventsDataScope();

  for (let block of ctx.blocks) {
    for (let item of block.items) {
      const eventItem = item as EventItem;
      const eventHandlerContext = {
        ...ctx,
        block: block.header,
        // @ts-ignore
        event: eventItem.event as SubstrateEvent
      } as EventContext;

      switch (item.name) {
        case 'Posts.PostCreated': {
          const callData =
            argsParsers.call.parsePostCreatedCallArgs(eventHandlerContext);
          const eventData =
            argsParsers.event.parsePostCreatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.PostCreated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...callData,
            ...eventData
          });

          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Account, eventData.accountId);
          if (callData.originalPost)
            ctx.store.deferredLoad(Post, callData.originalPost);
          if (callData.parentPostId)
            ctx.store.deferredLoad(Post, callData.parentPostId);
          if (callData.rootPostId)
            ctx.store.deferredLoad(Post, callData.rootPostId);
          break;
        }

        case 'Posts.PostUpdated': {
          const callData =
            argsParsers.call.parsePostUpdatedCallArgs(eventHandlerContext);
          const eventData =
            argsParsers.event.parsePostUpdatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.PostUpdated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });

          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Account, eventData.accountId);
          break;
        }

        case 'Posts.PostMoved': {
          const callData =
            argsParsers.call.parsePostMoveCallArgs(eventHandlerContext);
          const eventData =
            argsParsers.event.parsePostMovedEventArgs(eventHandlerContext);

          parsedData.set(EventName.PostMoved, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });
          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Account, eventData.accountId);
          if (eventData.fromSpace)
            ctx.store.deferredLoad(Space, eventData.fromSpace);
          if (callData.toSpace) ctx.store.deferredLoad(Space, callData.toSpace);
          break;
        }

        case 'Spaces.SpaceCreated': {
          const callData =
            argsParsers.call.parseSpaceCreateCallArgs(eventHandlerContext);
          const eventData =
            argsParsers.event.parseSpaceCreatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.SpaceCreated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });
          ctx.store.deferredLoad(Account, eventData.accountId);
          ctx.store.deferredLoad(Space, eventData.spaceId);
          break;
        }

        case 'Spaces.SpaceUpdated': {
          const callData =
            argsParsers.call.parseSpaceUpdateCallArgs(eventHandlerContext);
          const eventData =
            argsParsers.event.parseSpaceUpdatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.SpaceUpdated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });
          ctx.store.deferredLoad(Account, eventData.accountId);
          ctx.store.deferredLoad(Space, eventData.spaceId);
          break;
        }

        case 'Reactions.PostReactionCreated': {
          const callData =
            argsParsers.call.parsePostReactionCreateCallArgs(
              eventHandlerContext
            );
          const eventData =
            argsParsers.event.parsePostReactionCreatedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.PostReactionCreated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });

          ctx.store.deferredLoad(Account, eventData.accountId);
          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Reaction, eventData.reactionId);
          break;
        }

        case 'Reactions.PostReactionUpdated': {
          const callData =
            argsParsers.call.parsePostReactionUpdateCallArgs(
              eventHandlerContext
            );
          const eventData =
            argsParsers.event.parsePostReactionUpdatedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.PostReactionUpdated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });

          ctx.store.deferredLoad(Account, eventData.accountId);
          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Reaction, eventData.reactionId);
          break;
        }

        case 'Reactions.PostReactionDeleted': {
          const callData =
            argsParsers.call.parsePostReactionDeleteCallArgs(
              eventHandlerContext
            );
          const eventData =
            argsParsers.event.parsePostReactionDeletedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.PostReactionDeleted, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData,
            ...callData
          });

          ctx.store.deferredLoad(Account, eventData.accountId);
          ctx.store.deferredLoad(Post, eventData.postId);
          ctx.store.deferredLoad(Reaction, eventData.reactionId);
          break;
        }

        case 'Profiles.ProfileUpdated': {
          const eventData =
            argsParsers.event.parseProfileUpdatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.ProfileUpdated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          ctx.store.deferredLoad(Account, eventData.accountId);
          if (eventData.spaceId)
            ctx.store.deferredLoad(Space, eventData.spaceId);
          break;
        }

        case 'SpaceFollows.SpaceFollowed': {
          const eventData =
            argsParsers.event.parseSpaceFollowedEventArgs(eventHandlerContext);

          parsedData.set(EventName.SpaceFollowed, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          ctx.store.deferredLoad(Account, eventData.followerId);
          ctx.store.deferredLoad(Space, eventData.spaceId);
          break;
        }

        case 'SpaceFollows.SpaceUnfollowed': {
          const eventData =
            argsParsers.event.parseSpaceUnfollowedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.SpaceUnfollowed, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          ctx.store.deferredLoad(Account, eventData.followerId);
          ctx.store.deferredLoad(Space, eventData.spaceId);
          break;
        }

        case 'AccountFollows.AccountFollowed': {
          const eventData =
            argsParsers.event.parseAccountFollowedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.AccountFollowed, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          ctx.store.deferredLoad(Account, eventData.followerId);
          ctx.store.deferredLoad(Account, eventData.accountId);
          break;
        }

        case 'AccountFollows.AccountUnfollowed': {
          const eventData =
            argsParsers.event.parseAccountUnfollowedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.AccountUnfollowed, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          ctx.store.deferredLoad(Account, eventData.followerId);
          ctx.store.deferredLoad(Account, eventData.accountId);
          break;
        }
        default:
      }
    }
  }

  return parsedData;
}

export async function processEntityRelationsByStorageData(
  parsedEvents: ParsedEventsDataScope,
  ctx: Ctx
) {
  const storageManager = StorageDataManager.getInstance(ctx);

  for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
    switch (eventName) {
      case EventName.PostCreated: {
        for (const event of [...eventsData.values()] as PostCreatedData[]) {
          const storagePostData = storageManager
            .getStorageDataForSection('post')
            .get(event.postId) as PostWithDetails | undefined;

          if (!storagePostData) continue;

          ctx.store.deferredLoad(Account, storagePostData.post.struct.ownerId);
          if (storagePostData.post.struct.parentId)
            ctx.store.deferredLoad(Post, storagePostData.post.struct.parentId);
          if (storagePostData.post.struct.parentId)
            ctx.store.deferredLoad(
              Post,
              storagePostData.post.struct.rootPostId
            );
          if (storagePostData.space)
            ctx.store.deferredLoad(Space, storagePostData.space.id);
        }
        break;
      }
      case EventName.PostUpdated: {
        for (const event of [...eventsData.values()] as PostUpdatedData[]) {
          const storagePostData = storageManager
            .getStorageDataForSection('post')
            .get(event.postId) as PostWithDetails | undefined;

          if (!storagePostData) continue;

          if (storagePostData.post.struct.parentId)
            ctx.store.deferredLoad(Post, storagePostData.post.struct.parentId);
          if (storagePostData.post.struct.parentId)
            ctx.store.deferredLoad(
              Post,
              storagePostData.post.struct.rootPostId
            );
          if (storagePostData.space)
            ctx.store.deferredLoad(Space, storagePostData.space.id);
        }
        break;
      }
      default:
    }
  }
}
