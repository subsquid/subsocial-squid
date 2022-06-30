import { Account, Post, Activity, Reaction } from '../../model';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';

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

  const upvotesCount = !post.upvotesCount ? 0 : post.upvotesCount;
  const downvotesCount = !post.downvotesCount ? 0 : post.downvotesCount;

  let creator = post.createdByAccount; // Regular Post
  if (post.rootPost) {
    creator = post.rootPost.createdByAccount; // Comment Post
  } else if (post.parentPost) {
    creator = post.parentPost.createdByAccount; // Reply Post
  }

  activity.aggregated = activity.account.id !== creator.id;
  activity.aggCount = BigInt(upvotesCount + downvotesCount - 1);

  await updateAggregatedStatus({
    eventName,
    post,
    ctx
  });

  return activity;
}
