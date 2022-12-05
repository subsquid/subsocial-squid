import { Post, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';
import {
  getAggregationCount,
  updateAggregatedStatus
} from './aggregationUtils';
import { getPostOwnerId } from './common';

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
  activity.space =
    post.space && post.space.id
      ? await ctx.store.get(Space, post.space.id, false)
      : null;

  const ownerId = await getPostOwnerId(post, ctx);

  activity.aggregated = activity.account.id !== ownerId;

  // TODO - add implementation
  // activity.aggCount = BigInt(
  //   await getAggregationCount({
  //     eventName: activity.event,
  //     account: activity.account,
  //     post,
  //     ctx
  //   })
  // );
  //
  // await updateAggregatedStatus({
  //   eventName: activity.event,
  //   post,
  //   ctx
  // });

  return activity;
}
