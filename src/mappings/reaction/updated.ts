import { Account, Post, Reaction, Activity } from '../../model';
import { ReactionKind } from '../../common/types';
import { ReactionsPostReactionUpdatedEvent } from '../../types/generated/events';
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

  if (event.isV1) {
    const [accountId, postId, reactionId] = event.asV1;
    const reactionKind = getReactionKindFromCall(
      'Reactions.PostReactionUpdated',
      ctx
    );
    if (!reactionKind) {
      new CommonCriticalError(
        'reactionKind can not be extracted from extrinsic'
      );
      return null;
    }
    return {
      accountId: addressSs58ToString(accountId),
      postId: postId.toString(),
      reactionId: reactionId.toString(),
      reactionKind
    };
  }
  if (event.isV15) {
    const [accountId, postId, reactionId, reactionKind] = event.asV15;
    return {
      accountId: addressSs58ToString(accountId),
      postId: postId.toString(),
      reactionId: reactionId.toString(),
      reactionKind: ReactionKind[reactionKind.__kind]
    };
  }
  throw new UnknownVersionError(event.constructor.name);
}

export async function postReactionUpdated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionUpdatedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

  const account = await ensureAccount(accountId, ctx);

  const reaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: ['post', 'post.createdByAccount', 'post.space', 'account']
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    return;
  }

  reaction.kind = reactionKind as unknown as ReactionKind;
  reaction.updatedAtTime = new Date(ctx.block.timestamp);
  reaction.updatedAtBlock = BigInt(ctx.block.height.toString());
  await ctx.store.save<Reaction>(reaction);

  const { post } = reaction;

  if (reaction.kind === ReactionKind.Upvote) {
    post.upvotesCount = !post.upvotesCount ? 1 : post.upvotesCount + 1;
    post.downvotesCount = !post.downvotesCount ? 0 : post.downvotesCount - 1;
  } else if (reaction.kind === ReactionKind.Downvote) {
    post.downvotesCount = !post.downvotesCount ? 1 : post.downvotesCount + 1;
    post.upvotesCount = !post.upvotesCount ? 0 : post.upvotesCount - 1;
  }

  await ctx.store.save<Post>(post);

  const activity = await setActivity({
    account,
    reaction,
    post,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }
  await addNotificationForAccount(
    reaction.post.createdByAccount,
    activity,
    ctx
  );
}
