import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { Post, Activity, Account, EventName, Space } from '../../model';
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
import { SpaceCountersAction, PostCreatedData } from '../../common/types';
import { ensurePost } from './common';
import {
  addNotificationForAccount,
  addNotificationForAccountFollowers
} from '../notification';
import { Ctx } from '../../processor';

export async function postCreated(
  ctx: Ctx,
  eventData: PostCreatedData
): Promise<void> {
  const account = await ensureAccount(eventData.accountId, ctx);

  const post = await ensurePost({
    postId: eventData.postId,
    ctx,
    eventData
  });
  if (!post) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  if (post.sharedPost) await handlePostShare(post, account, ctx, eventData);

  await updatePostsCountersInSpace({
    space:
      post.space && post.space.id
        ? await ctx.store.get(Space, post.space.id, false)
        : null,
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
  if (!sharedPost.sharedPost || !sharedPost.sharedPost.id) return;

  const originPost = await ctx.store.get(Post, sharedPost.sharedPost.id, false);

  if (!originPost) {
    new EntityProvideFailWarning(
      Post,
      sharedPost.sharedPost.id,
      ctx,
      eventData
    );
    throw new CommonCriticalError();
  }

  const originPostRootPost =
    originPost.rootPost && originPost.rootPost.id
      ? await ctx.store.get(Post, originPost.rootPost.id, false)
      : null;

  const originPostParentPost =
    originPost.parentPost && originPost.parentPost.id
      ? await ctx.store.get(Post, originPost.parentPost.id, false)
      : null;

  originPost.sharesCount += 1;

  await ctx.store.deferredUpsert(originPost);

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
    (originPost.isComment && !originPostParentPost)
  ) {
    await addNotificationForAccountFollowers(
      originPost.ownedByAccount.id,
      activity,
      ctx
    );
    await addNotificationForAccount(
      originPost.ownedByAccount.id,
      activity,
      ctx
    );
  } else if (
    originPost.isComment &&
    originPostParentPost &&
    originPostRootPost
  ) {
    /**
     * Notifications should not be added for owner followers if post is reply
     */
    await addNotificationForAccount(
      originPostRootPost.ownedByAccount.id,
      activity,
      ctx
    );
    await addNotificationForAccount(
      originPostParentPost.ownedByAccount.id,
      activity,
      ctx
    );
  }
}

//
// export async function postCreated(ctx: EventHandlerContext): Promise<void> {
//   const event = new PostsPostCreatedEvent(ctx);
//   printEventLog(ctx);
//
//   const { account: accountId, postId } = event.asV13;
//
//   // @ts-ignore
//   const account = await ensureAccount(addressSs58ToString(accountId), ctx);
//
//   const post = await ensurePost({
//     account,
//     postId: postId.toString(),
//     ctx
//   });
//   if (!post) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Post, postId.toString(), ctx);
//     throw new CommonCriticalError();
//   }
//
//   await ctx.store.save<Post>(post);
//
//   if (post.sharedPost) await handlePostShare(post, account, ctx);
//
//   await updatePostsCountersInSpace({
//     space: post.space || null,
//     post,
//     action: SpaceCountersAction.PostAdded,
//     ctx
//   });
//
//   /**
//    * Currently each post/comment/comment reply has initial follower as it's creator.
//    */
//   await postFollowed(post, ctx);
//
//   const activity = await setActivity({
//     syntheticEventName: getSyntheticEventName(EventName.PostCreated, post),
//     account,
//     post,
//     ctx
//   });
//
//   if (!activity) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Activity, 'new', ctx);
//     return;
//   }
//   await addPostToFeeds(post, activity, ctx);
//
//   if (post.sharedPost) return;
//
//   if (!post.isComment || (post.isComment && !post.parentPost)) {
//     await addNotificationForAccount(post.ownedByAccount, activity, ctx);
//   } else if (post.isComment && post.parentPost && post.rootPost) {
//     /**
//      * Notifications should not be added for owner followers if post is reply
//      */
//     await addNotificationForAccount(
//       post.rootPost.ownedByAccount,
//       activity,
//       ctx
//     );
//     await addNotificationForAccount(
//       post.parentPost.ownedByAccount,
//       activity,
//       ctx
//     );
//   }
// }
//
// async function handlePostShare(
//   sharedPost: Post,
//   callerAccount: Account,
//   ctx: EventHandlerContext
// ): Promise<void> {
//   if (!sharedPost.sharedPost) return;
//
//   const originPost = sharedPost.sharedPost;
//
//   originPost.sharesCount += 1;
//
//   await ctx.store.save<Post>(originPost);
//
//   const activity = await setActivity({
//     account: callerAccount,
//     post: originPost,
//     syntheticEventName: getSyntheticEventName(EventName.PostShared, originPost),
//     ctx
//   });
//
//   if (!activity) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Activity, 'new', ctx);
//     throw new CommonCriticalError();
//   }
//
//   if (
//     !originPost.isComment ||
//     (originPost.isComment && !originPost.parentPost)
//   ) {
//     await addNotificationForAccountFollowers(
//       originPost.ownedByAccount,
//       activity,
//       ctx
//     );
//     await addNotificationForAccount(originPost.ownedByAccount, activity, ctx);
//   } else if (
//     originPost.isComment &&
//     originPost.parentPost &&
//     originPost.rootPost
//   ) {
//     /**
//      * Notifications should not be added for owner followers if post is reply
//      */
//     await addNotificationForAccount(
//       originPost.rootPost.ownedByAccount,
//       activity,
//       ctx
//     );
//     await addNotificationForAccount(
//       originPost.parentPost.ownedByAccount,
//       activity,
//       ctx
//     );
//   }
// }
//
