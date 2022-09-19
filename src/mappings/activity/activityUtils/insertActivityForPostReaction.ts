import { Post, Activity, Reaction, EventName } from '../../../model';
import { EventHandlerContext } from '../../../common/contexts';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';

type InsertActivityForPostReactionParams = {
  post: Post;
  reaction: Reaction;
  activity: Activity;
  ctx: EventHandlerContext;
};

export async function insertActivityForPostReaction(
  params: InsertActivityForPostReactionParams
): Promise<Activity> {
  const { activity, reaction, post, ctx } = params;
  const { event: eventName } = activity;

  if (
    eventName !== EventName.PostReactionDeleted &&
    eventName !== EventName.CommentReactionDeleted &&
    eventName !== EventName.CommentReplyReactionDeleted
  )
    activity.reaction = reaction;

  activity.post = post;
  activity.space = post.rootPost ? post.rootPost.space : post.space;

  const aggCountNum = post.upvotesCount + post.downvotesCount - 1;

  let owner = post.ownedByAccount; // Regular Post
  if (post.rootPost) {
    owner = post.rootPost.ownedByAccount; // Comment Post
  } else if (post.parentPost) {
    owner = post.parentPost.ownedByAccount; // Reply Post
  }

  activity.aggregated = activity.account.id !== owner.id;
  activity.aggCount = BigInt(ensurePositiveOrZeroValue(aggCountNum));

  await updateAggregatedStatus({
    eventName,
    post,
    ctx
  });

  return activity;
}
