import { resolvePostStruct, resolvePost } from './resolvers/resolvePostData';
import {
  addressSs58ToString,
  getDateWithoutTime,
  printEventLog
} from './utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { CommentStruct } from '@subsocial/types/dto';
import { isEmptyArray } from '@subsocial/utils';
import { Post, PostKind, Space, Account, Activity } from '../model';
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
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../common/errors';
import { EventHandlerContext } from '../common/contexts';

export async function postCreated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostCreatedEvent(ctx);
  printEventLog(ctx);

  const [accountId, postId] = event.asV1;

  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) return;

  const post: Post | null = await ensurePost({
    account,
    postId: postId.toString(),
    ctx
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    return;
  }

  await ctx.store.save<Post>(post);

  /**
   * Currently each post/comment/comment reply has initial follower as it's creator.
   */
  await postFollowed(post, ctx);

  const activity = await setActivity({
    account,
    post,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }
  await addPostToFeeds(post, activity, ctx);
}

// TODO refactor/review "postUpdated" implementation
export async function postUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostUpdatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, id] = event.asV1;

  const post = await ctx.store.get(Post, id.toString());
  if (!post) {
    new EntityProvideFailWarning(Post, id.toString(), ctx);
    return;
  }

  const postData = await resolvePost(id as unknown as PostId);
  if (!postData) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    return;
  }

  const postStruct = postData.post.struct;

  const postContent = postData.post.content;

  if (post.updatedAtTime === postStruct.updatedAtTime) return;

  const createdByAccount = await ensureAccount(
    postStruct.createdByAccount,
    ctx,
    true
  );

  if (!createdByAccount) {
    new EntityProvideFailWarning(Account, postStruct.createdByAccount, ctx);
    return;
  }

  post.createdByAccount = createdByAccount;

  post.content = postStruct.contentId;

  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;

  if (postStruct.spaceId) {
    const space = await ctx.store.get(Space, postStruct.spaceId.toString());
    if (space) {
      await updateCountersInSpace(ctx, space);
    } else {
      new EntityProvideFailWarning(Space, postStruct.spaceId.toString(), ctx);
    }
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
  const event = new PostsPostMovedEvent(ctx);
  printEventLog(ctx);

  const [accountId, postId] = event.asV9;

  // TODO update postsCount for old and new spaces

  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) {
    new EntityProvideFailWarning(Account, addressSs58ToString(accountId), ctx);
    return;
  }

  const post = await ctx.store.get(Post, {
    where: { id: postId.toString() },
    relations: ['space']
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    return;
  }
  const oldSpaceInst = post.space;

  const postStruct = await resolvePostStruct(postId as unknown as PostId);
  if (!postStruct || !postStruct.spaceId) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }

  const spaceInst = await ensureSpace({
    space: postStruct.spaceId,
    createIfNotExists: true,
    ctx
  });
  if (!spaceInst || !('id' in spaceInst)) {
    new EntityProvideFailWarning(Space, postStruct.spaceId, ctx);
    return;
  }
  post.space = spaceInst;

  await ctx.store.save<Post>(post);

  const activity = await setActivity({
    post,
    account,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }
  await addPostToFeeds(post, activity, ctx);
  await deleteSpacePostsFromFeedForAccount(account, oldSpaceInst, ctx);
}

// TODO add update of counters
export async function postShared(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);

  const event = new PostsPostSharedEvent(ctx);

  const [accountId, id] = event.asV1;
  const account = await ensureAccount(
    addressSs58ToString(accountId),
    ctx,
    true
  );

  if (!account) {
    new EntityProvideFailWarning(Account, addressSs58ToString(accountId), ctx);
    return;
  }

  const post = await ctx.store.get(Post, id.toString());
  if (!post) {
    new EntityProvideFailWarning(Post, id.toString(), ctx);
    return;
  }

  const postStruct = await resolvePostStruct(id as unknown as PostId);
  if (!postStruct) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }

  post.sharesCount = postStruct.sharesCount;

  await ctx.store.save<Post>(post);
  const activity = await setActivity({
    account,
    post,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }

  if (!post.isComment || (post.isComment && !post.parentId)) {
    await addNotificationForAccountFollowers(account, activity, ctx);
    await addNotificationForAccount(account, activity, ctx);
  } else if (post.isComment && post.parentId && post.rootPostId) {
    /**
     * Notifications should not be added for creator followers if post is reply
     */
    const rootPostInst = await ctx.store.get(Post, post.rootPostId);
    const parentCommentInst = await ctx.store.get(Post, post.parentId);
    if (!rootPostInst) {
      new EntityProvideFailWarning(Post, post.rootPostId, ctx);
      return;
    }
    if (!parentCommentInst) {
      new EntityProvideFailWarning(Post, post.parentId, ctx);
      return;
    }
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

// TODO refactoring is required
const updateReplyCount = async (ctx: EventHandlerContext, postId: bigint) => {
  const post = await ctx.store.get(Post, postId.toString());
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    return;
  }

  const postStruct = await resolvePostStruct(new BN(postId.toString(), 10));
  if (!postStruct) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }

  post.repliesCount = postStruct.repliesCount;
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount;
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount;

  await ctx.store.save<Post>(post);
};

export const ensurePost = async ({
  account,
  postId,
  ctx,
  createIfNotExists,
  relations
}: {
  account: Account | string;
  postId: string;
  ctx: EventHandlerContext;
  createIfNotExists?: boolean;
  relations?: string[];
}): Promise<Post | null> => {
  let existingPost = await ctx.store.get(Post, postId);
  if (relations)
    existingPost = await ctx.store.get(Post, {
      where: { id: postId },
      relations
    });

  if (existingPost) return existingPost;

  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) {
    new EntityProvideFailWarning(
      Account,
      typeof account === 'string' ? account : account.id,
      ctx
    );
    return null;
  }

  const postData = await resolvePost(new BN(postId.toString(), 10));

  if (
    !postData ||
    !postData.post ||
    !postData.post.struct ||
    !postData.post.content
  ) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    return null;
  }

  const { struct: postStruct, content: postContent } = postData.post;

  let space = null;

  if (!postStruct.isComment && postStruct.spaceId) {
    space = await ensureSpace({
      space: postStruct.spaceId,
      createIfNotExists: true,
      ctx
    });
  } else if (postStruct.isComment) {
    const { rootPostId } = postStruct as CommentStruct;
    const rootSpacePost = await ctx.store.get(Post, {
      where: { id: rootPostId },
      relations: ['space']
    });
    if (!rootSpacePost) {
      new EntityProvideFailWarning(Post, rootPostId, ctx);
      return null;
    }
    space = rootSpacePost.space;
  }

  if (!space || !('id' in space)) {
    new EntityProvideFailWarning(
      Space,
      postStruct.spaceId ? postStruct.spaceId.toString() : 'unknown',
      ctx
    );
    return null;
  }

  const post = new Post();

  post.id = postId.toString();
  post.isComment = postStruct.isComment;
  post.createdByAccount = accountInst;
  post.createdAtBlock = BigInt(postStruct.createdAtBlock.toString());
  post.createdAtTime = new Date(postStruct.createdAtTime);
  post.createdOnDay = getDateWithoutTime(new Date(postStruct.createdAtTime));
  post.content = postStruct.contentId;
  post.repliesCount = postStruct.repliesCount; // TODO review is required
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount; // TODO review is required
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount; // TODO review is required
  post.sharesCount = postStruct.sharesCount; // TODO review is required
  post.upvotesCount = 0;
  post.downvotesCount = 0;
  post.reactionsCount = 0;
  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;
  post.space = space;
  await updateCountersInSpace(ctx, space);

  if (postStruct.isComment) {
    post.kind = PostKind.Comment;
  } else if (postStruct.isRegularPost) {
    post.kind = PostKind.RegularPost;
  } else if (postStruct.isSharedPost) {
    post.kind = PostKind.SharedPost;
  }

  switch (
    post.kind // TODO review is required
  ) {
    case PostKind.Comment:
      const { rootPostId, parentId } = asCommentStruct(postStruct);

      post.rootPostId = rootPostId.toString();
      post.parentId = parentId?.toString();

      if (rootPostId && rootPostId !== null && ctx.store)
        await updateReplyCount(ctx, BigInt(rootPostId.toString()));
      if (parentId && parentId !== null && ctx.store)
        await updateReplyCount(ctx, BigInt(parentId.toString()));
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

  if (createIfNotExists) await ctx.store.save<Post>(post);

  return post;
};
