import { Post, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';

type InsertActivityForPostCreatedParams = {
  post: Post;
  activity: Activity;
  ctx: Ctx;
};

export async function insertActivityForPostCreated(
  params: InsertActivityForPostCreatedParams
): Promise<Activity> {
  const { activity, post, ctx } = params;

  if (!post.isComment) {
    /**
     * Regular Post
     */
    activity.post = post;
    activity.space =
      post.space && post.space.id
        ? await ctx.store.get(Space, post.space.id, false)
        : null;
    activity.aggregated = false;
    activity.aggCount = BigInt(0);
  } else if (post.isComment && post.rootPost && post.rootPost.id) {
    /**
     * Post Comment / Comment Reply
     */
    const parentPost = await ctx.store.get(
      Post,
      post.parentPost ? post.parentPost.id : null,
      false
    );
    const rootPost = await ctx.store.get(
      Post,
      post.rootPost ? post.rootPost.id : null,
      false
    );

    const ownerId = parentPost
      ? parentPost.ownedByAccount.id
      : rootPost
      ? rootPost.ownedByAccount.id
      : null; // Owner of either root post or parent comment

    activity.post = post;
    activity.space =
      rootPost && rootPost.space && rootPost.space.id
        ? await ctx.store.get(Space, rootPost.space.id, false)
        : null;
    activity.aggregated = activity.account.id !== ownerId;

    activity.aggCount = BigInt(
      await getAggregationCount({
        eventName: activity.event,
        account: activity.account,
        post,
        ctx
      })
    );
    await updateAggregatedStatus({
      eventName: activity.event,
      post,
      ctx
    });
  }

  return activity;
}
