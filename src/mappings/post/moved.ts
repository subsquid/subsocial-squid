import { resolvePostStruct } from '../../connection/resolvers/resolvePostData';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post, Space, Account, Activity } from '../../model';
import { PostsPostMovedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  addPostToFeeds,
  deleteSpacePostsFromFeedForAccount
} from '../newsFeed';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { SpaceCountersAction } from '../../common/types';

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
  const prevSpaceInst = post.space;

  /**
   * Update counters for previous space
   */
  await updatePostsCountersInSpace({
    space: prevSpaceInst,
    post,
    action: SpaceCountersAction.PostDeleted,
    ctx
  });

  const postStruct = await resolvePostStruct(postId as unknown as PostId);
  if (!postStruct || !postStruct.spaceId) {
    new MissingSubsocialApiEntity('PostStruct', ctx);
    return;
  }
  const newSpaceInst = await ctx.store.get(Space, {
    where: {
      id: postStruct.spaceId
    },
    relations: ['ownerAccount', 'createdByAccount']
  });

  if (!newSpaceInst) {
    new EntityProvideFailWarning(Space, postStruct.spaceId, ctx);
    return;
  }
  post.space = newSpaceInst;

  /**
   * Update counters for new space
   */
  await updatePostsCountersInSpace({
    space: newSpaceInst,
    post,
    action: SpaceCountersAction.PostAdded,
    ctx
  });

  await ctx.store.save<Post>(post);

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
  await deleteSpacePostsFromFeedForAccount(account, prevSpaceInst, ctx);
}
