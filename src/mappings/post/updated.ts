import { resolvePost } from '../../connection/resolvers/resolvePostData';
import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post, Account, EventName, Space } from '../../model';
import { PostsPostUpdatedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import {
  PostCreatedData,
  PostUpdatedData,
  SpaceCountersAction
} from '../../common/types';
import { isEmptyArray } from '@subsocial/utils';
import { Ctx } from '../../processor';
import { StorageDataManager } from '../../storage/storageDataManager';

export async function postUpdated(
  ctx: Ctx,
  eventData: PostUpdatedData
): Promise<void> {
  const post = await ctx.store.get(Post, eventData.postId);
  if (!post) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const prevVisStateHidden = post.hidden;

  // const postStorageData = StorageDataManager.getInstance(
  //   ctx
  // ).getStorageDataById('post', eventData.blockHash, eventData.postId);
  //
  // if (!postStorageData) {
  //   new MissingSubsocialApiEntity('Post', ctx, eventData);
  //   throw new CommonCriticalError();
  // }

  const storageDataManagerInst = StorageDataManager.getInstance(ctx);
  const postIpfsContent = storageDataManagerInst.getIpfsContentByCid(
    'post',
    eventData.ipfsSrc
  );

  const ownedByAccount = await ensureAccount(
    post.ownedByAccount.id || eventData.accountId,
    ctx,
    '876a9485-c5ac-4198-8e49-9f18bb770e57'
  );

  post.hidden = eventData.hidden ?? true;
  post.ownedByAccount = ownedByAccount;
  post.content = eventData.ipfsSrc;
  post.updatedAtTime = eventData.timestamp;

  if (postIpfsContent) {
    post.title = postIpfsContent.title ?? null;
    post.image = postIpfsContent.image ?? null;
    post.link = postIpfsContent.link ?? null;
    // post.format = postIpfsContent.format ?? null; // TODO check is it actual property
    post.format = null;
    post.canonical = postIpfsContent.canonical ?? null;
    post.body = postIpfsContent.body ?? null;
    post.summary = postIpfsContent.summary ?? null;
    post.slug = null;
    post.tagsOriginal = postIpfsContent.tags?.join(',') ?? null;

    // TODO Implementation is needed
    // const { meta } = postContent;
    // if (meta && !isEmptyArray(meta)) {
    //   post.proposalIndex = meta[0].proposalIndex;
    // }
  }

  await ctx.store.deferredUpsert(post);

  await updatePostsCountersInSpace({
    space:
      post.space && post.space.id
        ? await ctx.store.get(Space, post.space.id, false)
        : null,
    post,
    isPrevVisStateHidden: prevVisStateHidden,
    action: SpaceCountersAction.PostUpdated,
    ctx
  });

  await setActivity({
    syntheticEventName: getSyntheticEventName(EventName.PostUpdated, post),
    account: eventData.accountId,
    post,
    ctx,
    eventData
  });
}
