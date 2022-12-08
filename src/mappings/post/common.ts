import { getDateWithoutTime } from '../../common/utils';
import { isEmptyArray } from '@subsocial/utils';
import { Post, PostKind, Space } from '../../model';
import {
  asCommentStruct,
  asSharedPostStruct
} from '@subsocial/api/subsocial/flatteners/utils';
import { ensureAccount } from '../account';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import assert from 'assert';
import { PostsCreatePostCall } from '../../types/generated/calls';
import { PostCreatedData } from '../../common/types';
import { Ctx } from '../../processor';
import { StorageDataManager } from '../../storage/storageDataManager';

const updatePostReplyCount = async (
  targetPost: Post,
  reply: Post,
  ctx: Ctx
): Promise<void> => {
  const targetPostUpdated = targetPost;
  targetPostUpdated.repliesCount += 1;
  if (reply.hidden) {
    targetPostUpdated.hiddenRepliesCount += 1;
  } else {
    targetPostUpdated.publicRepliesCount += 1;
  }
  await ctx.store.deferredUpsert(targetPostUpdated);
};

/**
 * @deprecated in Batch processor config
 */
export const updateSpaceForPostChildren = async (
  rootPost: Post,
  newSpace: Space | null,
  ctx: Ctx
) => {
  // if (!rootPost.isComment) return;
  //
  // const children = await ctx.store.find(Post, {
  //   where: [
  //     {
  //       rootPost: { id: rootPost.id }
  //     },
  //     {
  //       parentPost: { id: rootPost.id }
  //     }
  //   ],
  //   relations: {
  //     space: true
  //   }
  // });
  //
  // for (let i = 0; i <= children.length - 1; i++) {
  //   children[i].space = newSpace;
  // }
  // await ctx.store.save<Post>(children);
};

export const ensurePost = async ({
  postId,
  ctx,
  eventData
}: {
  postId: string;
  ctx: Ctx;
  eventData: PostCreatedData;
}): Promise<Post | null> => {
  const storageDataManagerInst = StorageDataManager.getInstance(ctx);

  // const postStorageData = storageDataManagerInst.getStorageDataById(
  //   'post',
  //   eventData.blockHash,
  //   postId
  // );
  //
  // if (!postStorageData) {
  //   new MissingSubsocialApiEntity('Post', ctx, eventData);
  //   throw new CommonCriticalError();
  // }

  const postIpfsContent = await storageDataManagerInst.fetchIpfsContentByCid(
    'post',
    eventData.ipfsSrc
  );

  let space = null;

  if (eventData.postKind === PostKind.RegularPost) {
    if (eventData.spaceId) {
      space = await ctx.store.get(Space, eventData.spaceId, false);
    }
  }
  /**
   * TODO We won't add space to child posts (comment/replies) to avoid redundant processing in root PostMoved event
   */
  // else if (eventData.postKind === PostKind.Comment) {
  //   const rootSpacePost = eventData.rootPostId
  //     ? await ctx.store.get(Post, eventData.rootPostId, false)
  //     : null;
  //
  //   if (!rootSpacePost) {
  //     new EntityProvideFailWarning(
  //       Post,
  //       eventData.rootPostId || 'n/a',
  //       ctx,
  //       eventData
  //     );
  //     throw new CommonCriticalError();
  //   }
  //   if (rootSpacePost.space && rootSpacePost.space.id)
  //     space = await ctx.store.get(Space, rootSpacePost.space.id, false);
  // }

  const signerAccountInst = await ensureAccount(
    eventData.accountId,
    ctx,
    'a140c4ab-748a-42b2-86be-8628c5e3e5cb'
  );

  const post = new Post();

  if (eventData.forced && eventData.forcedData) {
    post.hidden = eventData.forcedData.hidden;
    post.ownedByAccount = await ensureAccount(
      eventData.forcedData.owner,
      ctx,
      '6afd11e7-555b-4c77-a55c-4218aa3e9b1c'
    );
    post.createdByAccount = await ensureAccount(
      eventData.forcedData.account,
      ctx,
      'fd17fcbf-743b-4ed4-9a5a-787018570cdf'
    );
    post.createdAtBlock = BigInt(eventData.forcedData.block.toString());
    post.createdAtTime = eventData.forcedData.time;
    post.createdOnDay = getDateWithoutTime(eventData.forcedData.time);
  } else {
    post.hidden = false;
    post.ownedByAccount = signerAccountInst;
    post.createdByAccount = signerAccountInst;
    post.createdAtBlock = BigInt(eventData.blockNumber.toString());
    post.createdAtTime = eventData.timestamp;
    post.createdOnDay = getDateWithoutTime(eventData.timestamp);
  }

  post.hiddenRepliesCount = 0;
  post.publicRepliesCount = 0;
  post.repliesCount = 0;
  post.sharesCount = 0;
  post.upvotesCount = 0;
  post.downvotesCount = 0;
  post.reactionsCount = 0;
  post.followersCount = 0;

  post.id = postId;
  post.isComment = eventData.postKind === PostKind.Comment;
  post.content = eventData.ipfsSrc;
  post.updatedAtTime = null;
  post.space = space;
  post.kind = eventData.postKind;

  switch (post.kind) {
    case PostKind.Comment:
      post.rootPost = eventData.rootPostId
        ? await ctx.store.get(Post, eventData.rootPostId, false)
        : null;
      post.parentPost = eventData.parentPostId
        ? await ctx.store.get(Post, eventData.parentPostId, false)
        : null;

      if (post.rootPost) await updatePostReplyCount(post.rootPost, post, ctx);
      if (post.parentPost)
        await updatePostReplyCount(post.parentPost, post, ctx);
      break;

    case PostKind.SharedPost:
      post.sharedPost = eventData.originalPost
        ? await ctx.store.get(Post, eventData.originalPost, false)
        : null;
      break;
  }

  if (postIpfsContent) {
    post.title = postIpfsContent.title ?? null;
    post.image = postIpfsContent.image ?? null;
    post.link = postIpfsContent.link ?? null;
    // post.format = postIpfsContent.format ?? null; // TODO check is it actual property
    post.format = null;
    post.canonical = postIpfsContent.canonical ?? null;
    post.body = postIpfsContent.body;
    post.summary = postIpfsContent.summary;
    post.slug = null;
    if (postIpfsContent.tags) {
      post.tagsOriginal = Array.isArray(postIpfsContent.tags)
        ? postIpfsContent.tags.join(',')
        : postIpfsContent.tags;
    }

    // TODO Implementation is needed
    // const { meta } = postContent;
    //
    // if (meta && !isEmptyArray(meta)) {
    //   post.proposalIndex = meta[0].proposalIndex;
    // }
  }

  ctx.store.deferredUpsert(post);

  return post;
};
