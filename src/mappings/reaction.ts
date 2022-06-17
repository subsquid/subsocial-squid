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
import { setActivity } from './activity';
import { addNotificationForAccount } from './notification';

interface ReactionEvent {
  accId: Uint8Array;
  id: bigint;
}

function getPostReactionCreatedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionCreatedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { accId, id };
  } else {
    const [accId, id] = event.asV15;
    return { accId, id };
  }
}
function getPostReactionUpdatedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { accId, id };
  } else {
    const [accId, id] = event.asV15;
    return { accId, id };
  }
}
function getPostReactionDeletedEvent(ctx: EventHandlerContext): ReactionEvent {
  const event = new ReactionsPostReactionDeletedEvent(ctx);
  if (event.isV1) {
    const [accId, id] = event.asV1;
    return { accId, id };
  } else {
    const [accId, id] = event.asV15;
    return { accId, id };
  }
}

export async function postReactionCreated(
  ctx: EventHandlerContext
): Promise<void> {
  const { id } = getPostReactionCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  console.log(
    '===== postReactionCreated ctx.event.extrinsic ',
    ctx.event.extrinsic.args.forEach((argItem) => console.log(argItem)),
    ctx.event.params.forEach((argItem) => console.log(argItem))
  );
  await upvoteOrDownvotePost(id, ctx);
}

export async function postReactionUpdated(
  ctx: EventHandlerContext
): Promise<void> {
  const { id } = getPostReactionUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  console.log(
    '===== postReactionUpdated ctx.event.extrinsic ',
    ctx.event.extrinsic.args.forEach((argItem) => console.log(argItem)),
    ctx.event.params.forEach((argItem) => console.log(argItem))
  );
  await upvoteOrDownvotePost(id, ctx);
}

export async function postReactionDeleted(
  ctx: EventHandlerContext
): Promise<void> {
  const { id } = getPostReactionDeletedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
  console.log(
    '===== postReactionDeleted ctx.event.extrinsic ',
    ctx.event.extrinsic.args.forEach((argItem) => console.log(argItem)),
    ctx.event.params.forEach((argItem) => console.log(argItem))
  );
  await upvoteOrDownvotePost(id, ctx);
}

async function upvoteOrDownvotePost(id: bigint, ctx: EventHandlerContext) {
  const post = await ctx.store.get(Post, id.toString());
  if (!post) return;

  const postStruct = await resolvePostStruct(new BN(id.toString(), 10));
  if (!postStruct) return;

  post.upvotesCount = postStruct.upvotesCount;
  post.downvotesCount = postStruct.downvotesCount;
  post.score = postStruct.score;

  const savedPost = await ctx.store.save<Post>(post);

  const activity = await setActivity({
    account: savedPost.createdByAccount,
    post: savedPost,
    ctx
  });

  if (!activity) return;
  await addNotificationForAccount(savedPost.createdByAccount, activity, ctx);
}
