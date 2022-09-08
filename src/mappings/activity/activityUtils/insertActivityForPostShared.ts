import { Post, Activity } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';

type InsertActivityForPostSharedParams = {
  post: Post;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostShared(
  params: InsertActivityForPostSharedParams
): Promise<Activity> {
  const { activity, post, ctx } = params;

  activity.post = post;
  activity.space = post.space;

  let creator = post.createdByAccount; // Regular Post
  if (post.rootPost) {
    creator = post.rootPost.createdByAccount; // Comment Post
  } else if (post.parentPost) {
    creator = post.parentPost.createdByAccount; // Reply Post
  }

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

  return activity;
}
