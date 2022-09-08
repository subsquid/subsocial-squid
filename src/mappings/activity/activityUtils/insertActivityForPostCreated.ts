import { Post, Activity } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';

type InsertActivityForPostCreatedParams = {
  post: Post;
  activity: Activity;
  ctx: EventHandlerContext;
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
    activity.space = post.space;
    activity.aggregated = false;
    activity.aggCount = BigInt(0);
  } else if (post.isComment && post.rootPost) {
    /**
     * Post Comment / Comment Reply
     */
    const creator = post.parentPost
      ? post.parentPost.createdByAccount
      : post.rootPost.createdByAccount; // Creator of either root post or parent comment

    activity.post = post;
    activity.space = post.rootPost.space;
    activity.aggregated = activity.account.id !== creator.id;
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
