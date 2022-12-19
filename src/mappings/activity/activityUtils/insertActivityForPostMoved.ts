import { Post, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';

type InsertActivityForPostMovedParams = {
  post: Post;
  spacePrev: Space | null;
  activity: Activity;
  ctx: Ctx;
};

export async function insertActivityForPostMoved(
  params: InsertActivityForPostMovedParams
): Promise<Activity> {
  const { activity, post, spacePrev, ctx } = params;

  activity.post = post;
  activity.space = post.space;
  activity.spacePrev = spacePrev;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
