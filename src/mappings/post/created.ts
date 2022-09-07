import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Post, Activity, EventName } from '../../model';
import { PostsPostCreatedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import { postFollowed } from '../postCommentFollows';
import { addPostToFeeds } from '../newsFeed';
import {
  EntityProvideFailWarning,
  CommonCriticalError
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { SpaceCountersAction } from '../../common/types';
import { ensurePost } from './common';
import {
  addNotificationForAccount,
  addNotificationForAccountFollowers
} from '../notification';

export async function postCreated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostCreatedEvent(ctx);
  printEventLog(ctx);

  const { account: accountId, postId } = event.asV13;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

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

  if (post.sharedPost) await handlePostShare(post, ctx);

  await updatePostsCountersInSpace({
    space: post.space || null,
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

async function handlePostShare(
  sharedPost: Post,
  ctx: EventHandlerContext
): Promise<void> {
  if (!sharedPost.sharedPost) return;

  const originPost = sharedPost.sharedPost;
  const shareAccount = sharedPost.ownedByAccount;

  originPost.sharesCount += 1;

  await ctx.store.save<Post>(originPost);

  const activity = await setActivity({
    account: shareAccount,
    post: originPost,
    syntheticEventName: EventName.PostShared,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    throw new CommonCriticalError();
    return;
  }

  if (
    !originPost.isComment ||
    (originPost.isComment && !originPost.parentPost)
  ) {
    await addNotificationForAccountFollowers(shareAccount, activity, ctx);
    await addNotificationForAccount(shareAccount, activity, ctx);
  } else if (
    originPost.isComment &&
    originPost.parentPost &&
    originPost.rootPost
  ) {
    /**
     * Notifications should not be added for creator followers if post is reply
     */
    await addNotificationForAccount(
      originPost.rootPost.createdByAccount,
      activity,
      ctx
    );
    await addNotificationForAccount(
      originPost.parentPost.createdByAccount,
      activity,
      ctx
    );
  }
}
