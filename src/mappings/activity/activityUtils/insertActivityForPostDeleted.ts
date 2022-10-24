import { Post, Activity } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';

type InsertActivityForPostMovedParams = {
  post: Post;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostDeleted(
  params: InsertActivityForPostMovedParams
): Promise<Activity> {
  const { activity, post } = params;

  activity.post = post;
  activity.space = post.space;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
