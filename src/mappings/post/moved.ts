import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { Post, Space, Activity, EventName } from '../../model';
import { PostsPostMovedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
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
import { EventHandlerContext } from '../../common/contexts';
import {
  PostMovedData,
  PostUpdatedData,
  SpaceCountersAction
} from '../../common/types';
// import { updateSpaceForPostChildren } from './common';
import { postFollowed, postUnfollowed } from '../postCommentFollows';
import { Ctx } from '../../processor';

export async function postMoved(
  ctx: Ctx,
  eventData: PostMovedData
): Promise<void> {
  const account = await ensureAccount(eventData.accountId, ctx);

  const post = await ctx.store.get(Post, eventData.postId);

  if (!post) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  /**
   * Update counters for previous space. Will be skipped if post is restored
   * ("space" was null)
   */
  if (eventData.fromSpace)
    await updatePostsCountersInSpace({
      space: await ctx.store.get(Space, eventData.fromSpace, false),
      post,
      action: SpaceCountersAction.PostDeleted,
      ctx
    });

  let newSpaceInst = null;

  if (eventData.toSpace && eventData.toSpace !== '0') {
    newSpaceInst = await ctx.store.get(Space, eventData.toSpace, false);

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

  await ctx.store.deferredUpsert(post);

  if (!newSpaceInst) {
    await postUnfollowed(post, ctx);
  } else if (newSpaceInst && !eventData.fromSpace) {
    await postFollowed(post, ctx);
  }

  // await updateSpaceForPostChildren(post, newSpaceInst, ctx);

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(EventName.PostMoved, post),
    spacePrev: await ctx.store.get(Space, eventData.toSpace, false),
    account,
    post,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }

  // TODO - add implementation
  // await addPostToFeeds(post, activity, ctx);
  //
  // if (prevSpaceInst)
  //   await deleteSpacePostsFromFeedForAccount(account, prevSpaceInst, ctx);
}
