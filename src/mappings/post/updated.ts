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

  const postStorageData = StorageDataManager.getInstance(
    ctx
  ).getStorageDataById('post', eventData.blockHash, eventData.postId);

  if (!postStorageData) {
    new MissingSubsocialApiEntity('Post', ctx, eventData);
    throw new CommonCriticalError();
  }

  const ownedByAccount = await ensureAccount(
    post.ownedByAccount.id || eventData.accountId,
    ctx,
    '876a9485-c5ac-4198-8e49-9f18bb770e57'
  );

  post.hidden = eventData.hidden ?? true;
  post.ownedByAccount = ownedByAccount;
  post.content = eventData.ipfsSrc;
  post.updatedAtTime = eventData.timestamp;

  if (postStorageData.ipfsContent) {
    post.title = postStorageData.ipfsContent.title ?? null;
    post.image = postStorageData.ipfsContent.image ?? null;
    post.link = postStorageData.ipfsContent.link ?? null;
    // post.format = postStorageData.ipfsContent.format ?? null; // TODO check is it actual property
    post.format = null;
    post.canonical = postStorageData.ipfsContent.canonical ?? null;
    post.body = postStorageData.ipfsContent.body;
    post.summary = postStorageData.ipfsContent.summary;
    post.slug = null;
    post.tagsOriginal = postStorageData.ipfsContent.tags?.join(',') ?? null;

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
