import { resolvePost } from '../../connection/resolvers/resolvePostData';
import { getDateWithoutTime } from '../../common/utils';
import { isEmptyArray } from '@subsocial/utils';
import { Post, PostKind, Space, Account } from '../../model';
import BN from 'bn.js';
import {
  asCommentStruct,
  asSharedPostStruct
} from '@subsocial/api/flat-subsocial/flatteners';
import { ensureAccount } from '../account';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

const updatePostReplyCount = async (
  targetPost: Post,
  reply: Post,
  ctx: EventHandlerContext
): Promise<void> => {
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
