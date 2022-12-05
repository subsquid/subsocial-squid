import { Post, Activity, Space } from '../../../model';
import { Ctx } from '../../../processor';

type InsertActivityForPostMovedParams = {
  post: Post;
  activity: Activity;
  ctx: Ctx;
};

export async function insertActivityForPostDeleted(
  params: InsertActivityForPostMovedParams
): Promise<Activity> {
  const { activity, post, ctx } = params;

  activity.post = post;
  activity.space =
    post.space && post.space.id
      ? await ctx.store.get(Space, post.space.id, false)
      : null;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
