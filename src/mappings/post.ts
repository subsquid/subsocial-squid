import { resolvePostStruct, resolvePost } from './resolvers/resolvePostData';
import {
  addressSs58ToString,
  getDateWithoutTime,
  printEventLog
} from './utils';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { isEmptyArray } from '@subsocial/utils';
import { Post, PostKind, Space, Account } from '../model/generated';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import {
  PostsPostCreatedEvent,
  PostsPostSharedEvent,
  PostsPostUpdatedEvent,
  PostsPostMovedEvent
} from '../types/events';
import BN from 'bn.js';
import {
  asCommentStruct,
  asSharedPostStruct
} from '@subsocial/api/flat-subsocial/flatteners';
import { ensureAccount } from './account';
import { updateCountersInSpace, ensureSpace } from './space';
import { setActivity } from './activity';
import { postFollowed } from './post-comment-follows';
import {
  addPostToFeeds,
  deleteSpacePostsFromFeedForAccount
} from './news-feed';
import {
  addNotificationForAccount,
  addNotificationForAccountFollowers
} from './notification';

export async function postCreated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostCreatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, postId] = event.asV1;

  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) return;

  const post: Post | null = await ensurePost(account, postId, ctx);
  if (!post) return;

  await ctx.store.save<Post>(post);

  /**
   * Currently each post/comment has initial follower as it's creator.
   */
  await postFollowed(post, ctx);

  const activity = await setActivity({
    account,
    post,
    ctx
  });

  if (!activity) return;
  await addPostToFeeds(post, activity, ctx);
}

export async function postUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostUpdatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const post = await ctx.store.get(Post, id.toString());
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
  await setActivity({
    account: addressSs58ToString(accountId),
    post,
    ctx
  });
}

export async function postMoved(ctx: EventHandlerContext): Promise<void> {
  // TODO Post can be moved from space to space. It must be tracked.
  const event = new PostsPostMovedEvent(ctx);
  printEventLog(ctx);

  const [accountId, postId] = event.asV9;

  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) return;

  const post = await ctx.store.get(Post, postId.toString());
  if (!post) return;
  const oldSpaceInst = post.space;
  const postStruct = await resolvePostStruct(postId as unknown as PostId);
  if (!postStruct || !postStruct.spaceId) return;

  const spaceInst = await ensureSpace({
    space: postStruct.spaceId,
    createIfNotExists: true,
    ctx
  });
  if (!spaceInst || !('id' in spaceInst)) return;
  post.space = spaceInst;

  const postSaved = await ctx.store.save<Post>(post);

  const activity = await setActivity({
    post: postSaved,
    account,
    ctx
  });

  if (!activity) return;
  await addPostToFeeds(postSaved, activity, ctx);
  await deleteSpacePostsFromFeedForAccount(account, oldSpaceInst, ctx);
}

export async function postShared(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);

  const event = new PostsPostSharedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;
  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) return;

  const post = await ctx.store.get(Post, id.toString());
  if (!post) return;

  const postStruct = await resolvePostStruct(id as unknown as PostId);
  if (!postStruct) return;

  post.sharesCount = postStruct.sharesCount;

  await ctx.store.save<Post>(post);
  const activity = await setActivity({
    account,
    post,
    ctx
  });

  if (!activity) return;

  if (!post.isComment || (post.isComment && !post.parentId)) {
    /**
     * Notifications should not be added fo creator followers if post is reply
     */
    await addNotificationForAccountFollowers(account, activity, ctx);
    await addNotificationForAccount(account, activity, ctx);
  } else if (post.isComment && post.parentId && post.rootPostId) {
    const rootPostInst = await ctx.store.get(Post, post.rootPostId);
    const parentCommentInst = await ctx.store.get(Post, post.parentId);
    if (!rootPostInst || !parentCommentInst) return;
    await addNotificationForAccount(
      rootPostInst.createdByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(
      parentCommentInst.createdByAccount,
      activity,
      ctx
    );
  }
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

export const ensurePost = async (
  account: Account | string,
  id: bigint,
  ctx: EventHandlerContext
): Promise<Post | null> => {
  const { store }: { store: Store } = ctx;
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) return null;

  const postData = await resolvePost(new BN(id.toString(), 10));

  if (
    !postData ||
    !postData.post ||
    !postData.post.struct ||
    !postData.post.content
  )
    return null;

  const { struct: postStruct, content: postContent } = postData.post;

  let space = null;
  if (postStruct.spaceId && postStruct.spaceId !== '') {
    space = await store.get(Space, postStruct.spaceId.toString());
  }

  if (!space) return null;

  const post = new Post();

  post.id = id.toString();
  post.isComment = postStruct.isComment;
  post.createdByAccount = accountInst;
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
