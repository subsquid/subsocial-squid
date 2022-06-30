import assert from 'assert';
import { Account, Post, Reaction, Activity } from '../model';
import { ReactionKind, Status } from '../common/types';
import {
  ReactionsPostReactionCreatedEvent,
  ReactionsPostReactionDeletedEvent,
  ReactionsPostReactionUpdatedEvent
} from '../types/events';
import {
  ReactionsCreatePostReactionCall,
  ReactionsUpdatePostReactionCall
} from '../types/calls';

import { ReactionKind as ReactionKindV15 } from '../types/v15';
import { setActivity } from './activity';
import { addNotificationForAccount } from './notification';
import { ensureAccount } from './account';
import { addressSs58ToString, printEventLog } from './utils';
import { EventHandlerContext, CallContext } from '../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  UnknownVersionError
} from '../common/errors';

type ReactionEvent = {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
};

function getReactionKindFromCall(
  eventName: string,
  ctx: EventHandlerContext
): ReactionKind | null {
  assert(ctx.event.call);

  let call = null;
  let kind = null;
  switch (eventName) {
    case 'Reactions.PostReactionCreated':
      call = new ReactionsCreatePostReactionCall({
        _chain: ctx._chain,
        call: ctx.event.call
      });
      kind = call.asV1.kind;
      break;
    case 'Reactions.PostReactionUpdated':
      call = new ReactionsUpdatePostReactionCall({
        _chain: ctx._chain,
        call: ctx.event.call
      });
      kind = call.asV1.newKind;
      break;
  }

  if (!call || !kind) return null;

  return ReactionKind[kind.__kind as keyof typeof ReactionKind];
}

async function getReactionKindFromSquidDb(
  reactionId: string,
  ctx: EventHandlerContext
): Promise<ReactionKind | null> {
  const reaction = await ctx.store.get(Reaction, reactionId);
  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    return null;
  }
  return ReactionKind[reaction.kind];
}

function getPostReactionCreatedEvent(
  ctx: EventHandlerContext
): ReactionEvent | null {
  const event = new ReactionsPostReactionCreatedEvent(ctx);

  if (event.isV1) {
    const [accountId, postId, reactionId] = event.asV1;
    const reactionKind = getReactionKindFromCall(
      'Reactions.PostReactionCreated',
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

export async function postReactionCreated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionCreatedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

  const account = await ensureAccount(accountId, ctx);

  if (!account) {
    new EntityProvideFailWarning(Account, accountId, ctx);
    new CommonCriticalError();
    return;
  }

  const reaction = await ensureReaction({
    account,
    postId,
    reactionId,
    reactionKind,
    ctx
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
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

  // TODO track agg_count (upvotesCount + downvotesCount - 1)
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

export async function postReactionUpdated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionUpdatedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

  const account = await ensureAccount(accountId, ctx);
  if (!account) {
    new EntityProvideFailWarning(Account, accountId, ctx);
    return;
  }

  const reaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: ['post', 'post.createdByAccount', 'post.space', 'account']
  });

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    return;
  }

  reaction.kind = reactionKind as unknown as ReactionKind;
  reaction.updatedAtTime = new Date();
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

  // TODO track agg_count (upvotesCount + downvotesCount - 1)
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

export async function postReactionDeleted(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = await getPostReactionDeletedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

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

async function ensureReaction({
  account,
  postId,
  reactionId,
  reactionKind,
  ctx,
  createIfNotExists = false
}: {
  account: Account | string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
  ctx: EventHandlerContext;
  createIfNotExists?: boolean;
}): Promise<Reaction | null> {
  const existingReaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: ['post', 'post.createdByAccount', 'post.space']
  });
  if (existingReaction) return existingReaction;

  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) {
    new EntityProvideFailWarning(
      Account,
      typeof account === 'string' ? account : account.id,
      ctx
    );
    return null;
  }

  const postInst = await ctx.store.get(Post, {
    where: { id: postId },
    relations: ['createdByAccount', 'space']
  });

  if (!postInst) {
    new EntityProvideFailWarning(Post, postId, ctx);
    return null;
  }

  const newReaction: Reaction = new Reaction();
  newReaction.id = reactionId;
  newReaction.status = Status.Active;
  newReaction.account = accountInst;
  newReaction.post = postInst;
  newReaction.kind = reactionKind;
  newReaction.createdAtBlock = BigInt(ctx.block.height.toString());
  newReaction.createdAtTime = new Date();

  if (createIfNotExists) await ctx.store.save<Reaction>(newReaction);
  return newReaction;
}
