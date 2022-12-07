import { ReactionKind, Post, Reaction, Activity, EventName } from '../../model';
import { ReactionsPostReactionCreatedEvent } from '../../types/generated/events';
import { setActivity } from '../activity';
import { addNotificationForAccount } from '../notification';
import { ensureAccount } from '../account';
import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  UnknownVersionError
} from '../../common/errors';
import { getReactionKindFromCall, ensureReaction } from './common';
import { Ctx } from '../../processor';
import { PostReactionCreatedData } from '../../common/types';

export async function postReactionCreated(
  ctx: Ctx,
  eventData: PostReactionCreatedData
): Promise<void> {
  const { postId, reactionId } = eventData;

  const reaction = await ensureReaction({
    ctx,
    eventData
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx, eventData);
    throw new CommonCriticalError();
  }

  await ctx.store.deferredUpsert(reaction);

  const postInst = await ctx.store.get(Post, postId, false);

  if (!postInst) {
    new EntityProvideFailWarning(Post, postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  if (reaction.kind === ReactionKind.Upvote) {
    postInst.upvotesCount = !postInst.upvotesCount
      ? 1
      : postInst.upvotesCount + 1;
  } else if (reaction.kind === ReactionKind.Downvote) {
    postInst.downvotesCount = !postInst.downvotesCount
      ? 1
      : postInst.downvotesCount + 1;
  }
  postInst.reactionsCount = !postInst.reactionsCount
    ? 1
    : postInst.reactionsCount + 1;

  await ctx.store.deferredUpsert(postInst);

  const accountInst = await ensureAccount(
    eventData.forced && eventData.forcedData
      ? eventData.forcedData.account
      : eventData.accountId,
    ctx, '27dd085f-2586-449c-b8f7-0ce2e76b1c4d'
  );
  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(
      EventName.PostReactionCreated,
      postInst
    ),
    account: accountInst,
    post: postInst,
    reaction,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }
  await addNotificationForAccount(postInst.ownedByAccount, activity, ctx);
}
