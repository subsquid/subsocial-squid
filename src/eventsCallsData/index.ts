import { EventName } from '../model';
import { Block, Ctx, EventItem } from '../processor';
import {
  ParsedEventsData,
  ParsedEventsDataMap,
  PostCreatedData,
  PostUpdatedData,
  EventId,
  EventContext,
  EventData,
  SpaceCreatedData,
  SpaceUpdatedData,
  SpaceOwnershipTransferAcceptedData,
  PostMovedData,
  AccountFollowedData,
  AccountUnfollowedData,
  SpaceFollowedData,
  SpaceUnfollowedData,
  ProfileUpdatedData,
  PostReactionCreatedData,
  PostReactionUpdatedData,
  PostReactionDeletedData
} from '../common/types';
import argsParsers from './argsParsers';
import { SubstrateEvent } from '@subsquid/substrate-processor';

type EventDataType<T> = T extends EventName.SpaceCreated
  ? SpaceCreatedData
  : T extends EventName.SpaceUpdated
  ? SpaceUpdatedData
  : T extends EventName.PostCreated
  ? PostCreatedData
  : T extends EventName.PostUpdated
  ? PostUpdatedData
  : T extends EventName.PostMoved
  ? PostMovedData
  : T extends EventName.AccountFollowed
  ? AccountFollowedData
  : T extends EventName.AccountUnfollowed
  ? AccountUnfollowedData
  : T extends EventName.SpaceFollowed
  ? SpaceFollowedData
  : T extends EventName.SpaceUnfollowed
  ? SpaceUnfollowedData
  : T extends EventName.SpaceOwnershipTransferAccepted
  ? SpaceOwnershipTransferAcceptedData
  : T extends EventName.ProfileUpdated
  ? ProfileUpdatedData
  : T extends EventName.PostReactionCreated
  ? PostReactionCreatedData
  : T extends EventName.PostReactionUpdated
  ? PostReactionUpdatedData
  : T extends EventName.PostReactionDeleted
  ? PostReactionDeletedData
  : never;

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

  getSectionByEventName<T extends EventName>(
    section: T
  ): Map<EventId, EventDataType<T>> {
    return (
      (this.scope.get(section) as Map<EventId, EventDataType<T>>) ||
      new Map<EventId, EventDataType<T>>()
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
  let totalEventsNumber = 0;

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
          totalEventsNumber++;
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

          totalEventsNumber++;
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
          totalEventsNumber++;
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
          totalEventsNumber++;
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
          totalEventsNumber++;
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

          totalEventsNumber++;
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

          totalEventsNumber++;
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

          totalEventsNumber++;
          break;
        }

        case 'Profiles.ProfileUpdated': {
          const eventData =
            argsParsers.event.parseProfileUpdatedEventArgs(eventHandlerContext);

          parsedData.set(EventName.ProfileUpdated, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          totalEventsNumber++;
          break;
        }

        case 'SpaceFollows.SpaceFollowed': {
          const eventData =
            argsParsers.event.parseSpaceFollowedEventArgs(eventHandlerContext);

          parsedData.set(EventName.SpaceFollowed, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          totalEventsNumber++;
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

          totalEventsNumber++;
          break;
        }
        case 'SpaceOwnership.SpaceOwnershipTransferAccepted': {
          const eventData =
            argsParsers.event.parseSpaceOwnershipTransferAcceptedEventArgs(
              eventHandlerContext
            );

          parsedData.set(EventName.SpaceOwnershipTransferAccepted, {
            ...getEventMetadata(block, item.event as SubstrateEvent),
            ...eventData
          });

          totalEventsNumber++;
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
          totalEventsNumber++;
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

          totalEventsNumber++;
          break;
        }
        default:
      }
    }
  }

  ctx.log.info(`Total number of events for processing - ${totalEventsNumber}`);
  return parsedData;
}
