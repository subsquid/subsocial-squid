import { Post, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';

type InsertActivityForPostSharedParams = {
  post: Post;
  activity: Activity;
  ctx: Ctx;
};

export async function insertActivityForPostShared(
  params: InsertActivityForPostSharedParams
): Promise<Activity> {
  const { activity, post, ctx } = params;

  activity.post = post;
  activity.space = post.space;

  const ownerId = post.parentPost
    ? post.parentPost.ownedByAccount.id
    : post.rootPost
    ? post.rootPost.ownedByAccount.id
    : null; // Owner of either root post or parent comment

  activity.aggregated = activity.account.id !== ownerId;

  activity.aggCount = BigInt(
    await getAggregationCount({
      eventName: activity.event,
      accountId: activity.account.id,
      postId: post.id,
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
