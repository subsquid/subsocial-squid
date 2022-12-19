import { getSyntheticEventName } from '../../common/utils';
import { Post, Activity, Account, EventName, Space } from '../../model';
import { getOrCreateAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import { postFollowed } from '../postCommentFollows';
import { addPostToFeeds } from '../newsFeed';
import {
  EntityProvideFailWarning,
  CommonCriticalError
} from '../../common/errors';
import { SpaceCountersAction, PostCreatedData } from '../../common/types';
import { ensurePost } from './common';
import {
  addNotificationForAccount,
  addNotificationForAccountFollowers
} from '../notification';
import { Ctx } from '../../processor';
import { ElasticSearchIndexerManager } from '../../elasticsearch';

export async function postCreated(
  ctx: Ctx,
  eventData: PostCreatedData
): Promise<void> {
  const account = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    'fc2cb4d7-402e-4ea8-b084-d3ef5bea2bc2'
  );

  const post = await ensurePost({
    postId: eventData.postId,
    ctx,
    eventData
  });

  await ctx.store.save(post);

  ElasticSearchIndexerManager.getInstance(ctx).addToQueue(post);

  if (post.sharedPost) await handlePostShare(post, account, ctx, eventData);

  await updatePostsCountersInSpace({
    space: post.space ?? null,
    post,
    action: SpaceCountersAction.PostAdded,
    ctx
  });

  /**
   * Currently each post/comment/comment reply has initial follower as it's creator.
   */
  await postFollowed(post, ctx);

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(EventName.PostCreated, post),
    account,
    post,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    return;
  }

  await addPostToFeeds(post, activity, ctx);

  if (post.sharedPost) return;

  if (!post.isComment || (post.isComment && !post.parentPost)) {
    await addNotificationForAccount(post.ownedByAccount, activity, ctx);
  } else if (post.isComment && post.parentPost && post.rootPost) {
    /**
     * Notifications should not be added for owner followers if post is reply
     */

    await addNotificationForAccount(
      post.rootPost.ownedByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(
      post.parentPost.ownedByAccount,
      activity,
      ctx
    );
  }
}

async function handlePostShare(
  sharedPost: Post,
  callerAccount: Account,
  ctx: Ctx,
  eventData: PostCreatedData
): Promise<void> {
  if (!sharedPost.sharedPost) return;

  const originPost = sharedPost.sharedPost;

  originPost.sharesCount += 1;

  await ctx.store.save(originPost);

  const activity = await setActivity({
    account: callerAccount,
    post: originPost,
    syntheticEventName: getSyntheticEventName(EventName.PostShared, originPost),
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }

  if (
    !originPost.isComment ||
    (originPost.isComment && !originPost.parentPost)
  ) {
    await addNotificationForAccountFollowers(
      originPost.ownedByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(originPost.ownedByAccount, activity, ctx);
  } else if (
    originPost.isComment &&
    originPost.parentPost &&
    originPost.rootPost
  ) {
    /**
     * Notifications should not be added for owner followers if post is reply
     */
    await addNotificationForAccount(
      originPost.rootPost.ownedByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(
      originPost.parentPost.ownedByAccount,
      activity,
      ctx
    );
  }
}
