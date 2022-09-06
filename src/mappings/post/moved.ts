import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Post, Space, Activity } from '../../model';
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
import { SpaceCountersAction } from '../../common/types';
import {
  getMovedPostSpaceIdFromCall,
  updateSpaceForPostChildren
} from './common';
import { postUnfollowed } from '../postCommentFollows';

export async function postMoved(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostMovedEvent(ctx);
  printEventLog(ctx);

  const {
    account: accountId,
    postId,
    fromSpace: fromSpaceId,
    toSpace: toSpaceId
  } = event.asV13;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  const post = await ctx.store.get(Post, {
    where: { id: postId.toString() },
    relations: {
      createdByAccount: true,
      rootPost: { createdByAccount: true },
      parentPost: { createdByAccount: true },
      space: { createdByAccount: true, ownerAccount: true }
    }
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    throw new CommonCriticalError();
    return;
  }
  const prevSpaceInst = post.space || null;

  /**
   * Update counters for previous space. Will be skipped if post is restored
   * ("space" was null)
   */
  if (prevSpaceInst)
    await updatePostsCountersInSpace({
      space: prevSpaceInst,
      post,
      action: SpaceCountersAction.PostDeleted,
      ctx
    });

  // const newSpaceId = getMovedPostSpaceIdFromCall(ctx);

  let newSpaceInst = null;

  if (toSpaceId && toSpaceId.toString() !== '0') {
    newSpaceInst = await ctx.store.get(Space, {
      where: {
        id: toSpaceId.toString()
      },
      relations: { ownerAccount: true, createdByAccount: true }
    });

    if (!newSpaceInst) {
      new EntityProvideFailWarning(Space, toSpaceId.toString() || 'null', ctx);
      throw new CommonCriticalError();
      return;
    }
  }

  post.space = newSpaceInst;

  /**
   * Update counters for new space
   */
  if (newSpaceInst)
    await updatePostsCountersInSpace({
      space: newSpaceInst,
      post,
      action: SpaceCountersAction.PostAdded,
      ctx
    });

  await ctx.store.save<Post>(post);

  if (!newSpaceInst) await postUnfollowed(post, ctx);

  await updateSpaceForPostChildren(post, newSpaceInst, ctx);

  const activity = await setActivity({
    post,
    spacePrev: prevSpaceInst,
    account,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    throw new CommonCriticalError();
    return;
  }
  await addPostToFeeds(post, activity, ctx);
  if (prevSpaceInst)
    await deleteSpacePostsFromFeedForAccount(account, prevSpaceInst, ctx);
}
