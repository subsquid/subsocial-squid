import { ReactionKind, Post, Reaction, Activity, EventName } from '../../model';
import { ReactionsPostReactionUpdatedEvent } from '../../types/generated/events';
import { setActivity } from '../activity';
import { addNotificationForAccount } from '../notification';
import { ensureAccount } from '../account';
import {
  addressSs58ToString,
  ensurePositiveOrZeroValue,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  UnknownVersionError
} from '../../common/errors';
import { getReactionKindFromCall } from './common';

type ReactionEvent = {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
};

function getPostReactionUpdatedEvent(
  ctx: EventHandlerContext
): ReactionEvent | null {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);
  const { account: accountId, postId, reactionId, reactionKind } = event.asV13;
  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind: ReactionKind[reactionKind.__kind]
  };
  throw new UnknownVersionError(event.constructor.name);
}

export async function postReactionUpdated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionUpdatedEvent(ctx);
  if (!event) return;

  const { accountId, reactionId, reactionKind } = event;

  const account = await ensureAccount(accountId, ctx);

  const reaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: {
      post: { ownedByAccount: true, createdByAccount: true, space: true },
      account: true
    }
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    throw new CommonCriticalError();
  }

  reaction.kind = reactionKind as unknown as ReactionKind;
  reaction.updatedAtTime = new Date(ctx.block.timestamp);
  reaction.updatedAtBlock = BigInt(ctx.block.height.toString());
  await ctx.store.save<Reaction>(reaction);

  const { post } = reaction;

  if (reaction.kind === ReactionKind.Upvote) {
    post.upvotesCount += 1;
    post.downvotesCount = ensurePositiveOrZeroValue(post.downvotesCount - 1);
  } else if (reaction.kind === ReactionKind.Downvote) {
    post.downvotesCount += 1;
    post.upvotesCount = ensurePositiveOrZeroValue(post.upvotesCount - 1);
  }

  await ctx.store.save<Post>(post);

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(
      EventName.PostReactionCreated,
      post
    ),
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
    reaction.post.ownedByAccount,
    activity,
    ctx
  );
}
