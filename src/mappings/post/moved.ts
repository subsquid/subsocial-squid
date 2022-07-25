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
import { EntityProvideFailWarning } from '../../common/errors';
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

  const [accountId, postId] = event.asV9;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  const post = await ctx.store.get(Post, {
    where: { id: postId.toString() },
    relations: [
      'space',
      'createdByAccount',
      'rootPost',
      'parentPost',
      'rootPost.createdByAccount',
      'parentPost.createdByAccount',
      'space.ownerAccount',
      'space.createdByAccount'
    ]
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
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

  const newSpaceId = getMovedPostSpaceIdFromCall(ctx);
  let newSpaceInst = null;

  if (newSpaceId !== '0') {
    newSpaceInst = await ctx.store.get(Space, {
      where: {
        id: newSpaceId
      },
      relations: ['ownerAccount', 'createdByAccount']
    });

    if (!newSpaceInst) {
      new EntityProvideFailWarning(Space, newSpaceId || 'null', ctx);
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
    return;
  }
  await addPostToFeeds(post, activity, ctx);
  if (prevSpaceInst)
    await deleteSpacePostsFromFeedForAccount(account, prevSpaceInst, ctx);
}
