import { Post, Activity } from '../../../model';
import { EventName } from '../../../common/types';
import { EventHandlerContext } from '../../../common/contexts';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';

type InsertActivityForPostSharedParams = {
  eventName: EventName;
  post: Post;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostShared(
  params: InsertActivityForPostSharedParams
): Promise<Activity> {
  const { activity, post, eventName, ctx } = params;

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
      eventName,
      account: activity.account,
      post,
      ctx
    })
  );

  await updateAggregatedStatus({
    eventName,
    post,
    ctx
  });

  return activity;
}
