import { Post, Activity, Space } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';

type InsertActivityForPostMovedParams = {
  eventName: EventName;
  post: Post;
  spacePrev: Space;
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
