import { resolvePostStruct, resolvePost } from './resolvers/resolvePostData';
import {
  addressSs58ToString,
  getDateWithoutTime,
  printEventLog
} from './utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
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
import { updatePostsCountersInSpace } from './space';
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
import { SpaceCountersAction } from '../common/types';

export async function postCreated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostCreatedEvent(ctx);
  printEventLog(ctx);

  const [accountId, postId] = event.asV1;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  if (!account) return;

  const post = await ensurePost({
    account,
    postId: postId.toString(),
    ctx
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    return;
  }

  await ctx.store.save<Post>(post);

  await updatePostsCountersInSpace({
    space: post.space,
    post,
    action: SpaceCountersAction.PostAdded,
    ctx
  });

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

  const post = await ctx.store.get(Post, {
    where: { id: id.toString() },
    relations: [
      'space',
      'createdByAccount',
      'rootPost',
      'parentPost',
      'rootPost.createdByAccount',
      'parentPost.createdByAccount',
      'space.ownerAccount',
      'space.createdByAccount'
    ]
  });
  if (!post) {
    new EntityProvideFailWarning(Post, id.toString(), ctx);
    return;
  }

  const prevVisStateHidden = post.hidden;

  const postData = await resolvePost(id as unknown as PostId);
  if (!postData) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    return;
  }

  const { struct: postStruct, content: postContent } = postData.post;

  if (post.updatedAtTime === postStruct.updatedAtTime) return;

  const createdByAccount = await ensureAccount(
    postStruct.createdByAccount,
    ctx
  );

  if (!createdByAccount) {
    new EntityProvideFailWarning(Account, postStruct.createdByAccount, ctx);
    return;
  }

  post.hidden = postStruct.hidden;
  post.createdByAccount = createdByAccount;
  post.content = postStruct.contentId;
  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;

  if (postContent) {
    post.title = postContent.title;
    post.image = postContent.image;
    post.summary = postContent.summary;
    post.slug = null;
    post.tagsOriginal = postContent.tags?.join(',');
  }

  await ctx.store.save<Post>(post);

  await updatePostsCountersInSpace({
    space: post.space,
    post,
    isPrevVisStateHidden: prevVisStateHidden,
    action: SpaceCountersAction.PostUpdated,
    ctx
  });

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

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  if (!account) {
    new EntityProvideFailWarning(Account, addressSs58ToString(accountId), ctx);
    return;
  }

  const post = await ctx.store.get(Post, {
    where: { id: postId.toString() },
    relations: [
      'space',
      'createdByAccount',
      'rootPost',
      'parentPost',
      'rootPost.createdByAccount',
      'parentPost.createdByAccount',
      'space.ownerAccount',
      'space.createdByAccount'
    ]
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    return;
  }
  const prevSpaceInst = post.space;

  /**
   * Update counters for previous space
   */
  await updatePostsCountersInSpace({
    space: prevSpaceInst,
    post,
    action: SpaceCountersAction.PostDeleted,
    ctx
  });

  const postStruct = await resolvePostStruct(postId as unknown as PostId);
  if (!postStruct || !postStruct.spaceId) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }
  const newSpaceInst = await ctx.store.get(Space, postStruct.spaceId);

  if (!newSpaceInst || !('id' in newSpaceInst)) {
    new EntityProvideFailWarning(Space, postStruct.spaceId, ctx);
    return;
  }
  post.space = newSpaceInst;

  /**
   * Update counters for new space
   */
  await updatePostsCountersInSpace({
    space: newSpaceInst,
    post,
    action: SpaceCountersAction.PostAdded,
    ctx
  });

  await ctx.store.save<Post>(post);

  const activity = await setActivity({
    post,
    spacePrev: prevSpaceInst,
    account,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }
  await addPostToFeeds(post, activity, ctx);
  await deleteSpacePostsFromFeedForAccount(account, prevSpaceInst, ctx);
}

export async function postShared(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);

  const event = new PostsPostSharedEvent(ctx);

  const [accountId, id] = event.asV1;
  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  if (!account) {
    new EntityProvideFailWarning(Account, addressSs58ToString(accountId), ctx);
    return;
  }

  const post = await ctx.store.get(Post, {
    where: { id: id.toString() },
    relations: [
      'space',
      'createdByAccount',
      'parentPost',
      'rootPost',
      'parentPost.createdByAccount',
      'rootPost.createdByAccount',
      'space.ownerAccount',
      'space.createdByAccount'
    ]
  });
  if (!post) {
    new EntityProvideFailWarning(Post, id.toString(), ctx);
    return;
  }

  const postStruct = await resolvePostStruct(id as unknown as PostId);
  if (!postStruct) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }

  post.sharesCount = !post.sharesCount ? 1 : post.sharesCount + 1;

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

  if (!post.isComment || (post.isComment && !post.parentPost)) {
    await addNotificationForAccountFollowers(account, activity, ctx);
    await addNotificationForAccount(account, activity, ctx);
  } else if (post.isComment && post.parentPost && post.rootPost) {
    /**
     * Notifications should not be added for creator followers if post is reply
     */
    await addNotificationForAccount(
      post.rootPost.createdByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(
      post.parentPost.createdByAccount,
      activity,
      ctx
    );
  }
}

const updatePostReplyCount = async (
  targetPost: Post,
  reply: Post,
  ctx: EventHandlerContext
) => {
  const targetPostUpdated = targetPost;
  targetPostUpdated.repliesCount = !targetPostUpdated.repliesCount
    ? 1
    : targetPostUpdated.repliesCount + 1;
  if (reply.hidden) {
    targetPostUpdated.hiddenRepliesCount = !targetPostUpdated.hiddenRepliesCount
      ? 1
      : targetPostUpdated.hiddenRepliesCount + 1;
  } else {
    targetPostUpdated.publicRepliesCount = !targetPostUpdated.publicRepliesCount
      ? 1
      : targetPostUpdated.publicRepliesCount + 1;
  }
  await ctx.store.save<Post>(targetPostUpdated);
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
    space = await ctx.store.get(Space, {
      where: { id: postStruct.spaceId },
      relations: ['createdByAccount', 'ownerAccount']
    });
  } else if (postStruct.isComment) {
    const { rootPostId } = asCommentStruct(postStruct);
    const rootSpacePost = await ctx.store.get(Post, {
      where: { id: rootPostId },
      relations: [
        'createdByAccount',
        'space',
        'space.createdByAccount',
        'space.ownerAccount'
      ]
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
  post.hidden = postStruct.hidden;
  post.createdByAccount = accountInst;
  post.createdAtBlock = BigInt(postStruct.createdAtBlock.toString());
  post.createdAtTime = new Date(postStruct.createdAtTime);
  post.createdOnDay = getDateWithoutTime(new Date(postStruct.createdAtTime));
  post.content = postStruct.contentId;

  post.repliesCount = 0;
  post.hiddenRepliesCount = 0;
  post.publicRepliesCount = 0;

  post.sharesCount = 0;
  post.upvotesCount = 0;
  post.downvotesCount = 0;
  post.reactionsCount = 0;
  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;
  post.space = space;

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

      post.rootPost = await ctx.store.get(Post, {
        where: { id: rootPostId },
        relations: ['createdByAccount', 'space']
      });
      post.parentPost = await ctx.store.get(Post, {
        where: { id: parentId },
        relations: ['createdByAccount', 'space']
      });

      if (post.rootPost) await updatePostReplyCount(post.rootPost, post, ctx);
      if (post.parentPost)
        await updatePostReplyCount(post.parentPost, post, ctx);
      break;

    case PostKind.SharedPost:
      const { sharedPostId } = asSharedPostStruct(postStruct);
      post.sharedPost = await ctx.store.get(Post, sharedPostId);
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
