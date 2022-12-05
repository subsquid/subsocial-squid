import { Post, Activity, Reaction, EventName } from '../../../model';
import { Ctx } from '../../../processor';
import { updateAggregatedStatus } from './aggregationUtils';
import { ensurePositiveOrZeroValue } from '../../../common/utils';
import { getPostOwnerId } from "./common";

type InsertActivityForPostReactionParams = {
  post: Post;
  reaction: Reaction;
  activity: Activity;
  ctx: Ctx;
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
  activity.space = post.space;

  const aggCountNum = post.upvotesCount + post.downvotesCount - 1;

  const ownerId = await getPostOwnerId(post, ctx);

  activity.aggregated = activity.account.id !== ownerId;
  activity.aggCount = BigInt(ensurePositiveOrZeroValue(aggCountNum));

  // TODO - add implementation
  // await updateAggregatedStatus({
  //   eventName,
  //   post,
  //   ctx
  // });

  return activity;
}
