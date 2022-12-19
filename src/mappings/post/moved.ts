import {
  getSyntheticEventName,
} from '../../common/utils';
import { Post, Space, Activity, EventName } from '../../model';
import { getOrCreateAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  addPostToFeeds,
  deleteSpacePostsFromFeedForAccount
} from '../newsFeed';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import {
  PostMovedData,
  SpaceCountersAction
} from '../../common/types';
import { postFollowed, postUnfollowed } from '../postCommentFollows';
import { Ctx } from '../../processor';
import { getEntityWithRelations } from '../../common/gettersWithRelations';
import { ElasticSearchIndexerManager } from '../../elasticsearch';

export async function postMoved(
  ctx: Ctx,
  eventData: PostMovedData
): Promise<void> {
  const account = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    '92b75b7f-4397-4ff5-a387-ff214aa3c480'
  );

  const post = await getEntityWithRelations.post({
    postId: eventData.postId,
    ctx
  });

  if (!post) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const prevSpaceInst = await getEntityWithRelations.space(
    eventData.fromSpace,
    ctx
  );

  /**
   * Update counters for previous space. Will be skipped if post is restored
   * ("space" was null)
   */
  if (eventData.fromSpace)
    await updatePostsCountersInSpace({
      space: prevSpaceInst,
      post,
      action: SpaceCountersAction.PostDeleted,
      ctx
    });

  let newSpaceInst = null;

  if (eventData.toSpace && eventData.toSpace !== '0') {
    newSpaceInst = await getEntityWithRelations.space(eventData.toSpace, ctx);

    if (!newSpaceInst) {
      new EntityProvideFailWarning(
        Space,
        eventData.toSpace || 'null',
        ctx,
        eventData
      );
      throw new CommonCriticalError();
    }
  }

  post.space = newSpaceInst;

  /**
   * Update counters for new space. Ignore if move to null space.
   */
  if (newSpaceInst)
    await updatePostsCountersInSpace({
      space: newSpaceInst,
      post,
      action: SpaceCountersAction.PostAdded,
      ctx
    });

  await ctx.store.save(post);

  ElasticSearchIndexerManager.getInstance(ctx).addToQueue(post);

  if (!newSpaceInst) {
    await postUnfollowed(post, ctx);
  } else if (newSpaceInst && !eventData.fromSpace) {
    await postFollowed(post, ctx);
  }

  // await updateSpaceForPostChildren(post, newSpaceInst, ctx);

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(EventName.PostMoved, post),
    spacePrev: prevSpaceInst,
    account,
    post,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }

  await addPostToFeeds(post, activity, ctx);

  if (prevSpaceInst)
    await deleteSpacePostsFromFeedForAccount(account.id, prevSpaceInst, ctx);
}
