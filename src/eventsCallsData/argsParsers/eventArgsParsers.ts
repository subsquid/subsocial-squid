import { PostsCreatePostCall } from '../../types/generated/calls';
import { PostKind } from '../../model';

import {
  CreatePostEventParsedData,
  UpdatePostEventParsedData,
  MovedPostEventParsedData,
  EventContext,
  SpaceCreatedData,
  CreatedSpaceEventParsedData,
  UpdatedSpaceEventParsedData,
  PostReactionCreatedEventParsedData,
  PostReactionUpdatedEventParsedData,
  PostReactionDeletedEventParsedData,
  ProfileUpdatedEventParsedData,
  SpaceUnfollowedEventParsedData,
  SpaceFollowedEventParsedData,
  AccountFollowedEventParsedData, AccountUnfollowedEventParsedData
} from "../../common/types";
import {
  AccountFollowsAccountFollowedEvent, AccountFollowsAccountUnfollowedEvent,
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
} from "../../types/generated/events";
import { addressSs58ToString } from '../../common/utils';
import { getReactionKindDecorated } from '../decorators';

export function parsePostCreatedEventArgs(
  ctx: EventContext
): CreatePostEventParsedData {
  const event = new PostsPostCreatedEvent(ctx, ctx.event);

  const { account: accountId, postId } = event.asV13;

  const response: CreatePostEventParsedData = {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString()
  };

  return response;
}

export function parsePostUpdatedEventArgs(
  ctx: EventContext
): UpdatePostEventParsedData {
  const event = new PostsPostUpdatedEvent(ctx, ctx.event);

  const { account: accountId, postId } = event.asV13;

  const response: UpdatePostEventParsedData = {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString()
  };

  return response;
}

export function parsePostMovedEventArgs(
  ctx: EventContext
): MovedPostEventParsedData {
  const event = new PostsPostMovedEvent(ctx, ctx.event);

  const { account: accountId, postId, toSpace, fromSpace } = event.asV13;

  const response: MovedPostEventParsedData = {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    toSpace:
      toSpace !== null && toSpace !== undefined ? toSpace.toString() : toSpace,
    fromSpace:
      fromSpace !== null && fromSpace !== undefined
        ? fromSpace.toString()
        : fromSpace
  };

  return response;
}

export function parseSpaceCreatedEventArgs(
  ctx: EventContext
): CreatedSpaceEventParsedData {
  const event = new SpacesSpaceCreatedEvent(ctx, ctx.event);

  const { account: accountId, spaceId } = event.asV13;

  const response: CreatedSpaceEventParsedData = {
    accountId: addressSs58ToString(accountId),
    spaceId:
      spaceId !== null && spaceId !== undefined ? spaceId.toString() : spaceId
  };

  return response;
}

export function parseSpaceUpdatedEventArgs(
  ctx: EventContext
): UpdatedSpaceEventParsedData {
  const event = new SpacesSpaceUpdatedEvent(ctx, ctx.event);

  const { account: accountId, spaceId } = event.asV13;

  const response: UpdatedSpaceEventParsedData = {
    accountId: addressSs58ToString(accountId),
    spaceId:
      spaceId !== null && spaceId !== undefined ? spaceId.toString() : spaceId
  };

  return response;
}

export function parsePostReactionCreatedEventArgs(
  ctx: EventContext
): PostReactionCreatedEventParsedData {
  const event = new ReactionsPostReactionCreatedEvent(ctx, ctx.event);

  const { account: accountId, postId, reactionId, reactionKind } = event.asV13;

  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind: getReactionKindDecorated(reactionKind)
  };
}

export function parsePostReactionUpdatedEventArgs(
  ctx: EventContext
): PostReactionUpdatedEventParsedData {
  const event = new ReactionsPostReactionUpdatedEvent(ctx, ctx.event);

  const { account: accountId, postId, reactionId, reactionKind } = event.asV13;

  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    newReactionKind: getReactionKindDecorated(reactionKind)
  };
}

export function parsePostReactionDeletedEventArgs(
  ctx: EventContext
): PostReactionDeletedEventParsedData {
  const event = new ReactionsPostReactionDeletedEvent(ctx, ctx.event);

  const { account: accountId, postId, reactionId, reactionKind } = event.asV13;

  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind: getReactionKindDecorated(reactionKind)
  };
}

export function parseProfileUpdatedEventArgs(
  ctx: EventContext
): ProfileUpdatedEventParsedData {
  const event = new ProfilesProfileUpdatedEvent(ctx, ctx.event);

  const { account: accountId, spaceId } = event.asV13;

  return {
    accountId: addressSs58ToString(accountId),
    spaceId:
      spaceId !== null && spaceId !== undefined ? spaceId.toString() : spaceId
  };
}

export function parseSpaceFollowedEventArgs(
  ctx: EventContext
): SpaceFollowedEventParsedData {
  const event = new SpaceFollowsSpaceFollowedEvent(ctx, ctx.event);

  const { follower, spaceId } = event.asV13;

  return {
    followerId: addressSs58ToString(follower),
    spaceId: spaceId.toString()
  };
}

export function parseSpaceUnfollowedEventArgs(
  ctx: EventContext
): SpaceUnfollowedEventParsedData {
  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx, ctx.event);

  const { follower, spaceId } = event.asV13;

  return {
    followerId: addressSs58ToString(follower),
    spaceId: spaceId.toString()
  };
}

export function parseAccountFollowedEventArgs(
  ctx: EventContext
): AccountFollowedEventParsedData {
  const event = new AccountFollowsAccountFollowedEvent(ctx, ctx.event);

  const { follower, account } = event.asV13;

  return {
    followerId: addressSs58ToString(follower),
    accountId: addressSs58ToString(account)
  };
}

export function parseAccountUnfollowedEventArgs(
  ctx: EventContext
): AccountUnfollowedEventParsedData {
  const event = new AccountFollowsAccountUnfollowedEvent(ctx, ctx.event);

  const { follower, account } = event.asV13;

  return {
    followerId: addressSs58ToString(follower),
    accountId: addressSs58ToString(account)
  };
}
