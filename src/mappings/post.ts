import { resolvePostStruct, resolvePost } from './resolvers/resolvePostData';
import { addressSs58ToString, getDateWithoutTime } from './utils';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { isEmptyArray } from '@subsocial/utils';
import { Post, PostKind, Space } from '../model/generated';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import {
  PostsPostCreatedEvent,
  PostsPostSharedEvent,
  PostsPostUpdatedEvent
} from '../types/events';
import BN from 'bn.js';
import {
  asCommentStruct,
  asSharedPostStruct
} from '@subsocial/api/flat-subsocial/flatteners';
import { ensureAccount } from './account';
import { updateCountersInSpace } from './space';
import { setActivity } from './activity';

export async function postCreated(ctx: EventHandlerContext) {
  console.log('::::::::::::::::::::::: postCreated :::::::::::::::::::::::');
  const event = new PostsPostCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;
  const accountIdString = addressSs58ToString(accountId);

  const post: Post | null = await insertPost(accountIdString, id, ctx);

  if (post) {
    await ctx.store.save<Post>(post);
    console.log(`////////// Post ${id.toString()} has been created //////////`);
    await setActivity({
      account: accountIdString,
      post,
      ctx
    });
  }
}

export async function postUpdated(ctx: EventHandlerContext) {
  console.log('::::::::::::::::::::::: postUpdated :::::::::::::::::::::::');

  const event = new PostsPostUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const post = await ctx.store.get(Post, id.toString());
  console.log('post :: > ', post);
  if (!post) return;

  const postData = await resolvePost(id as unknown as PostId);
  if (!postData) return;

  const postStruct = postData.post.struct;

  const postContent = postData.post.content;

  if (post.updatedAtTime === postStruct.updatedAtTime) return;

  const createdByAccount = await ensureAccount(
    postStruct.createdByAccount,
    ctx,
    true
  );

  if (!createdByAccount) return;

  post.createdByAccount = createdByAccount;

  post.content = postStruct.contentId;

  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;

  if (postStruct.spaceId) {
    const space = await ctx.store.get(Space, postStruct.spaceId.toString());
    if (space) await updateCountersInSpace(ctx.store, space);
  }

  if (postContent) {
    post.title = postContent.title;
    post.image = postContent.image;
    post.summary = postContent.summary;
    post.slug = null;
    post.tagsOriginal = postContent.tags?.join(',');
  }

  await ctx.store.save<Post>(post);
  console.log(`////////// Post ${id.toString()} has been created //////////`);
  await setActivity({
    account: addressSs58ToString(accountId),
    post,
    ctx
  });
}

export async function postShared(ctx: EventHandlerContext) {
  console.log('::::::::::::::::::::::: postShared :::::::::::::::::::::::');

  const event = new PostsPostSharedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const post = await ctx.store.get(Post, id.toString());
  if (!post) return;

  const postStruct = await resolvePostStruct(id as unknown as PostId);
  if (!postStruct) return;

  post.sharesCount = postStruct.sharesCount;

  await ctx.store.save<Post>(post);
  console.log(`////////// Post ${id.toString()} has been shared //////////`);
  await setActivity({
    account: addressSs58ToString(accountId),
    post,
    ctx
  });
}

const updateReplyCount = async (store: Store, postId: bigint) => {
  const post = await store.get(Post, postId.toString());
  if (!post) return;

  const postStruct = await resolvePostStruct(new BN(postId.toString(), 10));
  if (!postStruct) return;

  post.repliesCount = postStruct.repliesCount;
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount;
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount;

  await store.save<Post>(post);
};

export const insertPost = async (
  accountId: string,
  id: bigint,
  ctx: EventHandlerContext
): Promise<Post | null> => {
  const { store }: { store: Store } = ctx;

  const postData = await resolvePost(new BN(id.toString(), 10));

  if (
    !postData ||
    !postData.post ||
    !postData.post.struct ||
    !postData.post.content
  )
    return null;

  const { struct: postStruct, content: postContent } = postData.post;
  const account = await ensureAccount(postStruct.createdByAccount, ctx, true);

  if (!account) return null;

  let space = null;
  if (postStruct.spaceId && postStruct.spaceId !== '') {
    space = await store.get(Space, postStruct.spaceId.toString());
  }

  if (!space) return null;

  const post = new Post();

  post.id = id.toString();
  post.createdByAccount = account;
  post.createdAtBlock = BigInt(postStruct.createdAtBlock.toString());
  post.createdAtTime = new Date(postStruct.createdAtTime);
  post.createdOnDay = getDateWithoutTime(new Date(postStruct.createdAtTime));
  post.content = postStruct.contentId;
  post.repliesCount = postStruct.repliesCount;
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount;
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount;
  post.sharesCount = postStruct.sharesCount;
  post.upvotesCount = postStruct.upvotesCount;
  post.downvotesCount = postStruct.downvotesCount;
  post.score = postStruct.score;
  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;
  post.space = space;
  await updateCountersInSpace(store, space);

  if (postStruct.isComment) {
    post.kind = PostKind.Comment;
  } else if (postStruct.isRegularPost) {
    post.kind = PostKind.RegularPost;
  } else if (postStruct.isSharedPost) {
    post.kind = PostKind.SharedPost;
  }

  switch (post.kind) {
    case PostKind.Comment:
      const { rootPostId, parentId } = asCommentStruct(postStruct);

      post.rootPostId = rootPostId.toString();
      post.parentId = parentId?.toString();

      if (rootPostId && rootPostId !== null && store)
        await updateReplyCount(store, BigInt(rootPostId.toString()));
      if (parentId && parentId !== null && store)
        await updateReplyCount(store, BigInt(parentId.toString()));
      break;

    case PostKind.SharedPost:
      const { sharedPostId } = asSharedPostStruct(postStruct);
      post.sharedPostId = sharedPostId;
      break;
  }

  if (postContent) {
    post.title = postContent.title;
    post.image = postContent.image;
    post.summary = postContent.summary;
    post.slug = null;
    post.tagsOriginal = postContent.tags?.join(',');

    const { meta } = postContent;

    if (meta && !isEmptyArray(meta)) {
      post.proposalIndex = meta[0].proposalIndex;
    }
  }

  return post;
};
