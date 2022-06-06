import { PostId } from '@subsocial/types/substrate/interfaces';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import BN from 'bn.js';
import { Post } from '../model';
import {
  ReactionsPostReactionCreatedEvent,
  ReactionsPostReactionDeletedEvent,
  ReactionsPostReactionUpdatedEvent
} from '../types/events';
import { resolvePostStruct } from './resolvers/resolvePostData';

interface ReactionEvent {
  id: bigint;
}

function getPostReactionCreatedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionCreatedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { id };
  } else {
    const [accId, id] = event.asV15;
    return { id };
  }
}
function getPostReactionUpdatedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { id };
  } else {
    const [accId, id] = event.asV15;
    return { id };
  }
}
function getPostReactionDeletedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionDeletedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { id };
  } else {
    const [accId, id] = event.asV15;
    return { id };
  }
}

export async function postReactionCreated(ctx: EventHandlerContext) {
  const { id } = getPostReactionCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  await upvoteOrDownvotePost(ctx.store, id);
}

export async function postReactionUpdated(ctx: EventHandlerContext) {
  const { id } = getPostReactionUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  await upvoteOrDownvotePost(ctx.store, id);
}

export async function postReactionDeleted(ctx: EventHandlerContext) {
  const { id } = getPostReactionDeletedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  await upvoteOrDownvotePost(ctx.store, id);
}

const upvoteOrDownvotePost = async (store: Store, id: bigint) => {
  const post = await store.get(Post, { where: { postId: id.toString() } });
  if (!post) return;

  const postStruct = await resolvePostStruct(new BN(id.toString(), 10));
  if (!postStruct) return;

  post.upvotesCount = postStruct.upvotesCount;
  post.downvotesCount = postStruct.downvotesCount;
  post.score = postStruct.score;

  await store.save<Post>(post);
};
