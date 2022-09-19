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
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import assert from 'assert';
import {
  PostsMovePostCall,
  PostsCreatePostCall
} from '../../types/generated/calls';
import { FindOptionsRelations } from 'typeorm';

export function getNewPostSpaceIdFromCall(
  ctx: EventHandlerContext
): string | null {
  assert(ctx.event.call);
  let spaceId: string | null = null;

  try {
    const call = new PostsCreatePostCall({
      _chain: ctx._chain,
      call: ctx.event.call
    });
    if (call.isV13) {
      spaceId = call.asV13.spaceIdOpt ? call.asV13.spaceIdOpt.toString() : null;
    }
  } catch (e) {
    const callArgs = ctx.event.call.args as {
      spaceIdOpt?: bigint;
      [k: string]: unknown;
    };
    spaceId = callArgs.spaceIdOpt ? callArgs.spaceIdOpt.toString() : null;
  }
  return spaceId ? spaceId.toString() : null;
}

export function getMovedPostSpaceIdFromCall(
  ctx: EventHandlerContext
): string | null {
  assert(ctx.event.call);
  let newSpaceId = null;
  //
  // try {
  //   const call = new PostsMovePostCall({
  //     _chain: ctx._chain,
  //     call: ctx.event.call
  //   });
  //   newSpaceId = call.asV9.newSpaceId;
  //   /**
  //    * For some reason if newSpaceId === 0 in extrinsic, "asV9" function returns
  //    * "undefined" for this property. As result, we need go through such
  //    * additional condition.
  //    */
  //   if (call.isV9 && call.asV9.postId && newSpaceId === undefined)
  //     newSpaceId = '0';
  // } catch (e) {
  //   const callData = ctx.event.call.args.calls.find(
  //     (callItem: { __kind: string; value: any }) =>
  //       callItem.__kind === 'Posts' &&
  //       callItem.value &&
  //       callItem.value.__kind === 'move_post'
  //   );
  //
  //   if (!callData) return null;
  //   newSpaceId = callData.value.newSpaceId
  //     ? callData.value.newSpaceId.toString()
  //     : null;
  // }
  //
  // return newSpaceId !== undefined && newSpaceId !== null
  //   ? newSpaceId.toString()
  //   : null;
  return null;
}

const updatePostReplyCount = async (
  targetPost: Post,
  reply: Post,
  ctx: EventHandlerContext
): Promise<void> => {
  const targetPostUpdated = targetPost;
  targetPostUpdated.repliesCount += 1;
  if (reply.hidden) {
    targetPostUpdated.hiddenRepliesCount += 1;
  } else {
    targetPostUpdated.publicRepliesCount += 1;
  }
  await ctx.store.save<Post>(targetPostUpdated);
};

export const updateSpaceForPostChildren = async (
  rootPost: Post,
  newSpace: Space | null,
  ctx: EventHandlerContext
) => {
  if (!rootPost.isComment) return;

  const children = await ctx.store.find(Post, {
    where: [
      {
        rootPost: { id: rootPost.id }
      },
      {
        parentPost: { id: rootPost.id }
      }
    ],
    relations: {
      space: true
    }
  });

  for (let i = 0; i <= children.length - 1; i++) {
    children[i].space = newSpace;
  }
  await ctx.store.save<Post>(children);
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
  relations?: FindOptionsRelations<Post>;
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

  const postData = await resolvePost(new BN(postId.toString(), 10));

  console.log('postData  - ', postData);

  if (!postData || !postData.post || !postData.post.struct) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    throw new CommonCriticalError();
  }

  const { struct: postStruct, content: postContent = null } = postData.post;

  let space = null;
  if (!postStruct.isComment) {
    const spaceId = getNewPostSpaceIdFromCall(ctx);
    if (spaceId) {
      space = await ctx.store.get(Space, {
        where: { id: spaceId },
        relations: { createdByAccount: true, ownerAccount: true }
      });
    }
  } else if (postStruct.isComment) {
    const { rootPostId } = asCommentStruct(postStruct);
    const rootSpacePost = await ctx.store.get(Post, {
      where: { id: rootPostId },
      relations: {
        ownedByAccount: true,
        createdByAccount: true,
        space: { createdByAccount: true, ownerAccount: true }
      }
    });
    if (!rootSpacePost) {
      new EntityProvideFailWarning(Post, rootPostId, ctx);
      throw new CommonCriticalError();
    }
    space = rootSpacePost.space;
  }

  const post = new Post();

  post.id = postId.toString();
  post.isComment = postStruct.isComment;
  post.hidden = postStruct.hidden;
  post.ownedByAccount =
    postStruct && postStruct.ownerId
      ? await ensureAccount(postStruct.ownerId, ctx)
      : accountInst;
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
  post.followersCount = 0;
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
        relations: { ownedByAccount: true, createdByAccount: true, space: true }
      });
      post.parentPost = await ctx.store.get(Post, {
        where: { id: parentId },
        relations: { ownedByAccount: true, createdByAccount: true, space: true }
      });

      if (post.rootPost) await updatePostReplyCount(post.rootPost, post, ctx);
      if (post.parentPost)
        await updatePostReplyCount(post.parentPost, post, ctx);
      break;

    case PostKind.SharedPost:
      const { originalPostId } = asSharedPostStruct(postStruct);
      post.sharedPost = await ctx.store.get(Post, {
        where: { id: originalPostId },
        relations: {
          createdByAccount: true,
          ownedByAccount: true,
          rootPost: { createdByAccount: true, ownedByAccount: true },
          parentPost: { createdByAccount: true, ownedByAccount: true },
          space: { ownerAccount: true, createdByAccount: true }
        }
      });
      break;
  }

  if (postContent) {
    post.title = postContent.title ?? null;
    post.image = postContent.image ?? null;
    post.link = postContent.link ?? null;
    post.format = postContent.format ?? null;
    post.canonical = postContent.canonical ?? null;
    post.body = postContent.body;
    post.summary = postContent.summary;
    post.slug = null;
    post.tagsOriginal = postContent.tags?.join(',') ?? null;
    const { meta } = postContent;

    if (meta && !isEmptyArray(meta)) {
      post.proposalIndex = meta[0].proposalIndex;
    }
  }

  if (createIfNotExists) await ctx.store.save<Post>(post);

  return post;
};
