import { Account, Post, Reaction, Activity } from '../../model';
import { ReactionKind, Status } from '../../common/types';
import { ReactionsPostReactionDeletedEvent } from '../../types/generated/events';

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
import { getReactionKindFromSquidDb } from './common';

type ReactionEvent = {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
};

async function getPostReactionDeletedEvent(
  ctx: EventHandlerContext
): Promise<ReactionEvent | null> {
  const event = new ReactionsPostReactionDeletedEvent(ctx);
  if (event.isV1) {
    const [accountId, postId, reactionId] = event.asV1;
    const reactionKind = await getReactionKindFromSquidDb(
      reactionId.toString(),
      ctx
    );
    if (!reactionKind) {
      new CommonCriticalError(
        'reactionKind can not be extracted from DB entity'
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

export async function postReactionDeleted(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = await getPostReactionDeletedEvent(ctx);
  if (!event) return;

  const { accountId, reactionId } = event;

  const accountInst = await ensureAccount(accountId, ctx);
  if (!accountInst) {
    new EntityProvideFailWarning(Account, accountId, ctx);
    return;
  }

  const reaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: ['account', 'post', 'post.createdByAccount', 'post.space']
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    return;
  }

  const { kind: deletedReactionKind, post: deletedReactionPost } = reaction;

  reaction.status = Status.Deleted;
  await ctx.store.save<Reaction>(reaction);

  if (deletedReactionKind === ReactionKind.Upvote) {
    deletedReactionPost.upvotesCount! -= 1;
  } else if (deletedReactionKind === ReactionKind.Downvote) {
    deletedReactionPost.downvotesCount! -= 1;
  }
  deletedReactionPost.reactionsCount! -= 1;

  await ctx.store.save<Post>(deletedReactionPost);

  // TODO track agg_count (upvotesCount + downvotesCount - 1)
  const activity = await setActivity({
    account: accountInst,
    post: deletedReactionPost,
    reaction,
    ctx
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }
  await addNotificationForAccount(
    deletedReactionPost.createdByAccount,
    activity,
    ctx
  );
}
