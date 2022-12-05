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
  activity.space =
    post.space && post.space.id
      ? await ctx.store.get(Space, post.space.id, false)
      : null;
  activity.spacePrev = spacePrev;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
