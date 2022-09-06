import { ReactionKind, Post, Reaction, Activity } from '../../model';
import { ReactionsPostReactionCreatedEvent } from '../../types/generated/events';
import { setActivity } from '../activity';
import { addNotificationForAccount } from '../notification';
import { ensureAccount } from '../account';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  UnknownVersionError
} from '../../common/errors';
import { getReactionKindFromCall, ensureReaction } from './common';

type ReactionEvent = {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
};

function getPostReactionCreatedEvent(
  ctx: EventHandlerContext
): ReactionEvent | null {
  const event = new ReactionsPostReactionCreatedEvent(ctx);

  // if (event.isV1) {
  //   const [accountId, postId, reactionId] = event.asV1;
  //   const reactionKind = getReactionKindFromCall(
  //     'Reactions.PostReactionCreated',
  //     ctx
  //   );
  //   if (!reactionKind) {
  //     new CommonCriticalError(
  //       'reactionKind can not be extracted from extrinsic'
  //     );
  //     return null;
  //   }
  //   return {
  //     accountId: addressSs58ToString(accountId),
  //     postId: postId.toString(),
  //     reactionId: reactionId.toString(),
  //     reactionKind
  //   };
  // }

  const { account: accountId, postId, reactionId, reactionKind } = event.asV13;
  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind: ReactionKind[reactionKind.__kind]
  };

  throw new UnknownVersionError(event.constructor.name);
}

export async function postReactionCreated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionCreatedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

  const account = await ensureAccount(accountId, ctx);

  const reaction = await ensureReaction({
    account,
    postId,
    reactionId,
    reactionKind,
    ctx
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    throw new CommonCriticalError();
    return;
  }

  await ctx.store.save<Reaction>(reaction);

  const { post } = reaction;

  if (reaction.kind === ReactionKind.Upvote) {
    post.upvotesCount = !post.upvotesCount ? 1 : post.upvotesCount + 1;
  } else if (reaction.kind === ReactionKind.Downvote) {
    post.downvotesCount = !post.downvotesCount ? 1 : post.downvotesCount + 1;
  }
  post.reactionsCount = !post.reactionsCount ? 1 : post.reactionsCount + 1;

  await ctx.store.save<Post>(post);

  const activity = await setActivity({
    account,
    reaction,
    post,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    throw new CommonCriticalError();
    return;
  }
  await addNotificationForAccount(
    reaction.post.createdByAccount,
    activity,
    ctx
  );
}
