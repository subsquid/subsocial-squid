import { Post, Activity, Space } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';

type InsertActivityForPostMovedParams = {
  post: Post;
  spacePrev: Space | null;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostMoved(
  params: InsertActivityForPostMovedParams
): Promise<Activity> {
  const { activity, post, spacePrev } = params;

  activity.post = post;
  activity.space = post.space;
  activity.spacePrev = spacePrev;
  activity.aggregated = false;
  activity.aggCount = BigInt(0);
  return activity;
}
