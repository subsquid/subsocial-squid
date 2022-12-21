import { getBodySummary, getSyntheticEventName } from '../../common/utils';
import { Post, Account, EventName, Space } from '../../model';
import { getOrCreateAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { PostUpdatedData, SpaceCountersAction } from '../../common/types';
import { Ctx } from '../../processor';
import { StorageDataManager } from '../../storage';
import { getEntityWithRelations } from '../../common/gettersWithRelations';
import { ElasticSearchIndexerManager } from '../../elasticsearch';

export async function postUpdated(
  ctx: Ctx,
  eventData: PostUpdatedData
): Promise<void> {
  const post = await getEntityWithRelations.post({
    postId: eventData.postId,
    ctx
  });
  if (!post) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const prevVisStateHidden = post.hidden;

  const storageDataManagerInst = StorageDataManager.getInstance(ctx);
  const postIpfsContent = await storageDataManagerInst.fetchIpfsContentByCid(
    'post',
    eventData.ipfsSrc
  );

  const ownedByAccount = await getOrCreateAccount(
    post.ownedByAccount.id || eventData.accountId,
    ctx
  );

  if (typeof eventData.hidden === 'boolean') post.hidden = eventData.hidden;
  post.ownedByAccount = ownedByAccount;
  post.content = eventData.ipfsSrc;
  post.updatedAtTime = eventData.timestamp;

  if (postIpfsContent) {
    const bodySummary = getBodySummary(postIpfsContent.body);
    post.title = postIpfsContent.title ?? null;
    post.image = postIpfsContent.image ?? null;
    post.link = postIpfsContent.link ?? null;
    // post.format = postIpfsContent.format ?? null; // TODO check is it actual property
    post.format = null;
    post.canonical = postIpfsContent.canonical ?? null;
    post.body = postIpfsContent.body ?? null;
    post.summary = bodySummary.summary;
    post.isShowMore = bodySummary.isShowMore;
    post.slug = null;

    if (postIpfsContent.tags) {
      post.tagsOriginal = Array.isArray(postIpfsContent.tags)
        ? postIpfsContent.tags.join(',')
        : postIpfsContent.tags;
    }

    // TODO Implementation is needed
    // const { meta } = postContent;
    // if (meta && !isEmptyArray(meta)) {
    //   post.proposalIndex = meta[0].proposalIndex;
    // }
  }

  await ctx.store.save(post);

  ElasticSearchIndexerManager.getInstance(ctx).addToQueue(post);

  await updatePostsCountersInSpace({
    space: post.space ?? null,
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
