import {
  EventName,
  ReactionKind,
  Post,
  Account,
  Space,
  Reaction
} from '../model';
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
import {
  ParsedEventsData,
  ParsedEventsDataMap,
  PostWithDetails,
  PostCreatedUpdatedData
} from './types';
import { addressSs58ToString } from './utils';
import { resolveSpacesData } from '../storage/space';
import { StorageDataManager } from '../storage/storageDataManager';

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
    timestamp: new Date(block.header.timestamp),
    block
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
          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();

          parsedData.set(EventName.PostUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded
          });

          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Account, accountIdDecoded);
          break;
        }

        case 'Posts.PostMoved': {
          const event = new PostsPostMovedEvent(ctx, item.event);
          const {
            account: accountId,
            postId,
            toSpace: toSpaceId
          } = event.asV13; // fromSpace is ignored here

          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();
          const spaceIdDecoded = toSpaceId ? toSpaceId.toString() : null;

          parsedData.set(EventName.PostMoved, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded,
            spaceId: spaceIdDecoded
          });
          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Account, accountIdDecoded);
          if (spaceIdDecoded) ctx.store.deferredLoad(Space, spaceIdDecoded);
          break;
        }

        case 'Spaces.SpaceCreated': {
          const event = new SpacesSpaceCreatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;
          const accountIdDecoded = addressSs58ToString(accountId);
          const spaceIdDecoded = spaceId.toString();

          parsedData.set(EventName.SpaceCreated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            spaceId: spaceIdDecoded
          });
          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Space, spaceIdDecoded);
          break;
        }

        case 'Spaces.SpaceUpdated': {
          const event = new SpacesSpaceUpdatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;
          const accountIdDecoded = addressSs58ToString(accountId);
          const spaceIdDecoded = spaceId.toString();

          parsedData.set(EventName.SpaceUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: addressSs58ToString(accountId),
            spaceId: spaceId.toString()
          });
          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Space, spaceIdDecoded);
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

          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();
          const reactionIdDecoded = reactionId.toString();

          parsedData.set(EventName.PostReactionCreated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded,
            reactionId: reactionIdDecoded,
            reactionKind: ReactionKind[reactionKind.__kind]
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Reaction, reactionIdDecoded);
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

          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();
          const reactionIdDecoded = reactionId.toString();

          parsedData.set(EventName.PostReactionUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded,
            reactionId: reactionIdDecoded,
            reactionKind: ReactionKind[reactionKind.__kind]
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Reaction, reactionIdDecoded);
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

          const accountIdDecoded = addressSs58ToString(accountId);
          const postIdDecoded = postId.toString();
          const reactionIdDecoded = reactionId.toString();

          parsedData.set(EventName.PostReactionDeleted, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            postId: postIdDecoded,
            reactionId: reactionIdDecoded,
            reactionKind: ReactionKind[reactionKind.__kind]
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Post, postIdDecoded);
          ctx.store.deferredLoad(Reaction, reactionIdDecoded);
          break;
        }

        case 'Profiles.ProfileUpdated': {
          const event = new ProfilesProfileUpdatedEvent(ctx, item.event);
          const { account: accountId, spaceId } = event.asV13;

          const accountIdDecoded = addressSs58ToString(accountId);
          const spaceIdDecoded = spaceId ? spaceId.toString() : null;

          parsedData.set(EventName.ProfileUpdated, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            spaceId: spaceIdDecoded
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          if (spaceIdDecoded) ctx.store.deferredLoad(Space, spaceIdDecoded);
          break;
        }

        case 'SpaceFollows.SpaceFollowed': {
          const event = new SpaceFollowsSpaceFollowedEvent(ctx, item.event);
          const { follower: followerId, spaceId } = event.asV13;

          const accountIdDecoded = addressSs58ToString(followerId);
          const spaceIdDecoded = spaceId.toString();

          parsedData.set(EventName.SpaceFollowed, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            spaceId: spaceIdDecoded
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Space, spaceIdDecoded);
          break;
        }

        case 'SpaceFollows.SpaceUnfollowed': {
          const event = new SpaceFollowsSpaceUnfollowedEvent(ctx, item.event);
          const { follower: followerId, spaceId } = event.asV13;

          const accountIdDecoded = addressSs58ToString(followerId);
          const spaceIdDecoded = spaceId.toString();

          parsedData.set(EventName.SpaceUnfollowed, {
            ...getEventMetadata(block, item.event.id),
            accountId: accountIdDecoded,
            spaceId: spaceIdDecoded
          });

          ctx.store.deferredLoad(Account, accountIdDecoded);
          ctx.store.deferredLoad(Space, spaceIdDecoded);
          break;
        }

        case 'AccountFollows.AccountFollowed': {
          const event = new AccountFollowsAccountFollowedEvent(ctx, item.event);
          const { follower: followerId, account: followingId } = event.asV13;

          const followerIdDecoded = addressSs58ToString(followerId);
          const followingIdDecoded = addressSs58ToString(followingId);

          parsedData.set(EventName.AccountFollowed, {
            ...getEventMetadata(block, item.event.id),
            followerId: followerIdDecoded,
            followingId: followingIdDecoded
          });

          ctx.store.deferredLoad(Account, followerIdDecoded);
          ctx.store.deferredLoad(Account, followingIdDecoded);
          break;
        }

        case 'AccountFollows.AccountUnfollowed': {
          const event = new AccountFollowsAccountUnfollowedEvent(
            ctx,
            item.event
          );
          const { follower: followerId, account: followingId } = event.asV13;

          const followerIdDecoded = addressSs58ToString(followerId);
          const followingIdDecoded = addressSs58ToString(followingId);

          parsedData.set(EventName.AccountUnfollowed, {
            ...getEventMetadata(block, item.event.id),
            followerId: followerIdDecoded,
            followingId: followingIdDecoded
          });

          ctx.store.deferredLoad(Account, followerIdDecoded);
          ctx.store.deferredLoad(Account, followingIdDecoded);
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
        for (const event of [
          ...eventsData.values()
        ] as PostCreatedUpdatedData[]) {
          const storagePostData = storageManager
            .getStorageData('post')
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
        for (const event of [
          ...eventsData.values()
        ] as PostCreatedUpdatedData[]) {
          const storagePostData = storageManager
            .getStorageData('post')
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
