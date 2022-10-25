import { EventName, ReactionKind, Post, Account, Space } from '../model';
import { Block, Ctx } from '../processor';
import {
  AccountFollowsAccountFollowedEvent,
  AccountFollowsAccountUnfollowedEvent,
  PostsPostCreatedEvent,
  PostsPostMovedEvent,
  PostsPostUpdatedEvent,
  ProfilesProfileUpdatedEvent,
  ReactionsPostReactionCreatedEvent,
  ReactionsPostReactionDeletedEvent,
  ReactionsPostReactionUpdatedEvent,
  SpaceFollowsSpaceFollowedEvent,
  SpaceFollowsSpaceUnfollowedEvent,
  SpacesSpaceCreatedEvent,
  SpacesSpaceUpdatedEvent
} from '../types/generated/events';
import { ParsedEventsData, ParsedEventsDataMap } from './types';
import { addressSs58ToString } from './utils';

export class ParsedEventsDataScope {
  private scope: ParsedEventsDataMap;

  constructor() {
    this.scope = new Map();
  }

  set(section: EventName, value: ParsedEventsData): void {
    this.scope.set(section, (this.scope.get(section) || new Set()).add(value));
  }

  get<T>(section: EventName): Set<T> {
    return (this.scope.get(section) as Set<T>) || new Set<T>();
  }

  entries(): IterableIterator<[EventName, Set<ParsedEventsData>]> {
    return this.scope.entries();
  }
}

function getEventMetadata(block: Block, eventId: string) {
  return {
    id: eventId,
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp)
  };
}

export function getParsedEventsData(ctx: Ctx): ParsedEventsDataScope {
  const parsedData = new ParsedEventsDataScope();

  for (let block of ctx.blocks) {
    for (let item of block.items) {
      switch (item.name) {
        case 'Posts.PostCreated': {
          const event = new PostsPostCreatedEvent(ctx, item.event);
          const { account: accountId, postId } = event.asV13;
          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();

          parsedData.set(EventName.PostCreated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded
          });

          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Account, accountIdDecoded);
          break;
        }

        case 'Posts.PostUpdated': {
          const event = new PostsPostUpdatedEvent(ctx, item.event);
          const { account: accountId, postId } = event.asV13;

          parsedData.set(EventName.PostUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            postId: postId.toString()
          });
          break;
        }

        case 'Posts.PostMoved': {
          const event = new PostsPostMovedEvent(ctx, item.event);
          const {
            account: accountId,
            postId,
            toSpace: toSpaceId
          } = event.asV13; // fromSpace is ignored here

          parsedData.set(EventName.PostMoved, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            postId: postId.toString(),
            spaceId: toSpaceId ? toSpaceId.toString() : null
          });
          break;
        }

        case 'Spaces.SpaceCreated': {
          const event = new SpacesSpaceCreatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;

          parsedData.set(EventName.SpaceCreated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            spaceId: spaceId.toString()
          });
          break;
        }

        case 'Spaces.SpaceUpdated': {
          const event = new SpacesSpaceUpdatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;

          parsedData.set(EventName.SpaceUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            spaceId: spaceId.toString()
          });
          break;
        }

        case 'Reactions.PostReactionCreated': {
          const event = new ReactionsPostReactionCreatedEvent(ctx, item.event);
          const {
            account: accountId,
            postId,
            reactionId,
            reactionKind
          } = event.asV13;

          parsedData.set(EventName.PostReactionCreated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            postId: postId.toString(),
            reactionId: reactionId.toString(),
            reactionKind: ReactionKind[reactionKind.__kind]
          });
          break;
        }

        case 'Reactions.PostReactionUpdated': {
          const event = new ReactionsPostReactionUpdatedEvent(ctx, item.event);
          const {
            account: accountId,
            postId,
            reactionId,
            reactionKind
          } = event.asV13;

          parsedData.set(EventName.PostReactionUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            postId: postId.toString(),
            reactionId: reactionId.toString(),
            reactionKind: ReactionKind[reactionKind.__kind]
          });
          break;
        }

        case 'Reactions.PostReactionDeleted': {
          const event = new ReactionsPostReactionDeletedEvent(ctx, item.event);
          const {
            account: accountId,
            postId,
            reactionId,
            reactionKind
          } = event.asV13;

          parsedData.set(EventName.PostReactionDeleted, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            postId: postId.toString(),
            reactionId: reactionId.toString(),
            reactionKind: ReactionKind[reactionKind.__kind]
          });
          break;
        }

        case 'Profiles.ProfileUpdated': {
          const event = new ProfilesProfileUpdatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;

          parsedData.set(EventName.ProfileUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            spaceId: spaceId ? spaceId.toString() : null
          });
          break;
        }

        case 'SpaceFollows.SpaceFollowed': {
          const event = new SpaceFollowsSpaceFollowedEvent(ctx, item.event);
          const { follower: followerId, spaceId } = event.asV13;

          parsedData.set(EventName.SpaceFollowed, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(followerId),
            spaceId: spaceId.toString()
          });
          break;
        }

        case 'SpaceFollows.SpaceUnfollowed': {
          const event = new SpaceFollowsSpaceUnfollowedEvent(ctx, item.event);
          const { follower: followerId, spaceId } = event.asV13;

          parsedData.set(EventName.SpaceUnfollowed, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(followerId),
            spaceId: spaceId.toString()
          });
          break;
        }

        case 'AccountFollows.AccountFollowed': {
          const event = new AccountFollowsAccountFollowedEvent(ctx, item.event);
          const { follower: followerId, account: followingId } = event.asV13;

          parsedData.set(EventName.AccountFollowed, {
            ...getEventMetadata(block, item.event.id),
            followerId: addressSs58ToString(followerId),
            followingId: addressSs58ToString(followingId)
          });
          break;
        }

        case 'AccountFollows.AccountUnfollowed': {
          const event = new AccountFollowsAccountUnfollowedEvent(
            ctx,
            item.event
          );
          const { follower: followerId, account: followingId } = event.asV13;

          parsedData.set(EventName.AccountUnfollowed, {
            ...getEventMetadata(block, item.event.id),
            followerId: addressSs58ToString(followerId),
            followingId: addressSs58ToString(followingId)
          });
          break;
        }
        default:
      }
    }
  }

  return parsedData;
}

export async function initialProcessingEntityRelations(
  parsedEvents: ParsedEventsDataScope,
  ctx: Ctx
) {
  for (const [eventName, eventsData] of [...parsedEvents.entries()]) {
    switch (eventName) {
      case EventName.PostCreated: {
        for (const event of [...eventsData.values()]) {
          const cacheData = await ctx.store.get(Post, event.postId, false);
          if (!cacheData) continue;
          ctx.store.deferredLoad(Account, cacheData.ownedByAccount.id);
        }
        break;
      }
      case EventName.PostUpdated: {
        for (const event of [...eventsData.values()]) {
          const cacheData = await ctx.store.get(Post, event.postId, false);
          if (!cacheData) continue;
          ctx.store.deferredLoad(Account, cacheData.ownedByAccount.id);
          if (cacheData.rootPost)
            ctx.store.deferredLoad(Post, cacheData.rootPost.id);
          if (cacheData.parentPost)
            ctx.store.deferredLoad(Post, cacheData.parentPost.id);
          if (cacheData.space)
            ctx.store.deferredLoad(Space, cacheData.space.id);
        }
        break;
      }
      default:
    }
  }
}
