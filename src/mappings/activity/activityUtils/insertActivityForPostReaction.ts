import { Post, Activity, Reaction, EventName } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';

type InsertActivityForPostReactionParams = {
  eventName: EventName;
  post: Post;
  reaction: Reaction;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostReaction(
  params: InsertActivityForPostReactionParams
): Promise<Activity> {
  const { eventName, activity, reaction, post, ctx } = params;

  if (eventName !== EventName.PostReactionDeleted) activity.reaction = reaction;
  activity.post = post;
  activity.space = post.rootPost ? post.rootPost.space : post.space;

  const aggCountNum = post.upvotesCount + post.downvotesCount - 1;

  let creator = post.createdByAccount; // Regular Post
  if (post.rootPost) {
    creator = post.rootPost.createdByAccount; // Comment Post
  } else if (post.parentPost) {
    creator = post.parentPost.createdByAccount; // Reply Post
  }

  activity.aggregated = activity.account.id !== creator.id;
  activity.aggCount = BigInt(ensurePositiveOrZeroValue(aggCountNum));

  await updateAggregatedStatus({
    eventName,
    post,
    ctx
  });

  return activity;
}
