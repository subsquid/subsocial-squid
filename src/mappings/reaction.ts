import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account, Post, Reaction, ReactionKind } from '../model';
import {
  ReactionsPostReactionCreatedEvent,
  ReactionsPostReactionDeletedEvent,
  ReactionsPostReactionUpdatedEvent
} from '../types/events';
import { ReactionKind as ReactionKindV15 } from '../types/v15';
import { setActivity } from './activity';
import { addNotificationForAccount } from './notification';
import { ensureAccount } from './account';
import { addressSs58ToString, printEventLog, Status } from './utils';
import { ensurePost } from './post';

type ReactionEvent = {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKindV15;
};

function getReactionKindFromExtrinsic(
  ctx: EventHandlerContext
): ReactionKindV15 | null {
  if (!ctx.event.extrinsic) return null;

  const { extrinsic: { args = [] } = {} } = ctx.event;

  let newReactionKind: ReactionKindV15 | null = null;

  args.forEach((argItem) => {
    if (argItem.name === 'kind' && !newReactionKind)
      newReactionKind = argItem.value as ReactionKindV15;
  });

  return newReactionKind;
}

async function getReactionKindFromSquidDb(
  reactionId: string,
  ctx: EventHandlerContext
): Promise<ReactionKindV15 | null> {
  const reaction = await ctx.store.get(Reaction, reactionId);
  if (!reaction) return null;
  return reaction.kind as unknown as ReactionKindV15;
}

function getPostReactionCreatedEvent(
  ctx: EventHandlerContext
): ReactionEvent | null {
  const event = new ReactionsPostReactionCreatedEvent(ctx);

  if (event.isV1) {
    const [accountId, postId, reactionId] = event.asV1;
    const reactionKind = getReactionKindFromExtrinsic(ctx);
    if (!reactionKind) return null;
    return {
      accountId: addressSs58ToString(accountId),
      postId: postId.toString(),
      reactionId: reactionId.toString(),
      reactionKind
    };
  }

  const [accountId, postId, reactionId, reactionKind] = event.asV15;
  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind
  };
}
function getPostReactionUpdatedEvent(
  ctx: EventHandlerContext
): ReactionEvent | null {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);

  if (event.isV1) {
    const [accountId, postId, reactionId] = event.asV1;
    const reactionKind = getReactionKindFromExtrinsic(ctx);
    if (!reactionKind) return null;
    return {
      accountId: addressSs58ToString(accountId),
      postId: postId.toString(),
      reactionId: reactionId.toString(),
      reactionKind
    };
  }
  const [accountId, postId, reactionId, reactionKind] = event.asV15;
  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind
  };
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
    if (!reactionKind) return null;
    return {
      accountId: addressSs58ToString(accountId),
      postId: postId.toString(),
      reactionId: reactionId.toString(),
      reactionKind
    };
  }
  const [accountId, postId, reactionId, reactionKind] = event.asV15;
  return {
    accountId: addressSs58ToString(accountId),
    postId: postId.toString(),
    reactionId: reactionId.toString(),
    reactionKind
  };
}

export async function postReactionCreated(
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);
  const event = getPostReactionCreatedEvent(ctx);
  if (!event) return;

  const { accountId, postId, reactionId, reactionKind } = event;

  const newReaction = await ensureReaction({
    account: accountId,
    postId,
    reactionId,
    reactionKind,
    ctx
  });

  if (!newReaction) return;

  const savedReaction = await ctx.store.save(Reaction, newReaction);

  if (!savedReaction) return;

  const { post } = savedReaction;

  if (savedReaction.kind === ReactionKind.Upvote) {
    post.upvotesCount = !post.upvotesCount ? 1 : post.upvotesCount + 1;
  } else if (savedReaction.kind === ReactionKind.Downvote) {
    post.downvotesCount = !post.downvotesCount ? 1 : post.downvotesCount + 1;
  }
  post.reactionsCount = !post.reactionsCount ? 1 : post.reactionsCount + 1;

  const savedPost = await ctx.store.save(Post, post);

  const activity = await setActivity({
    account: accountId,
    reaction: savedReaction,
    post: savedPost,
    ctx
  });

  if (!activity) return;
  await addNotificationForAccount(
    savedReaction.post.createdByAccount,
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

  const reaction = await ensureReaction({
    account: accountId,
    postId,
    reactionId,
    reactionKind,
    ctx
  });

  if (!reaction) return;

  reaction.kind = reactionKind as unknown as ReactionKind;
  reaction.updatedAtTime = new Date();
  reaction.updatedAtBlock = BigInt(ctx.event.blockNumber.toString());
  const savedReaction = await ctx.store.save(Reaction, reaction);

  if (!savedReaction) return;

  const { post } = savedReaction;

  if (savedReaction.kind === ReactionKind.Upvote) {
    post.upvotesCount = !post.upvotesCount ? 1 : post.upvotesCount + 1;
    post.downvotesCount = !post.downvotesCount ? 0 : post.downvotesCount - 1;
  } else if (savedReaction.kind === ReactionKind.Downvote) {
    post.downvotesCount = !post.downvotesCount ? 1 : post.downvotesCount + 1;
    post.upvotesCount = !post.upvotesCount ? 0 : post.upvotesCount - 1;
  }

  const savedPost = await ctx.store.save(Post, post);

  const activity = await setActivity({
    account: accountId,
    reaction: savedReaction,
    post: savedPost,
    ctx
  });

  if (!activity) return;
  await addNotificationForAccount(
    savedReaction.post.createdByAccount,
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

  const accountInst = await ensureAccount(accountId, ctx, true);
  if (!accountInst) return;

  const reaction = await ensureReaction({
    account: accountInst,
    postId,
    reactionId,
    reactionKind,
    ctx
  });

  if (!reaction) return;

  const { kind: deletedReactionKind, post: deletedReactionPost } = reaction;

  reaction.status = Status.Deleted;
  await ctx.store.save(Reaction, reaction); // TODO set activity status

  if (deletedReactionKind === ReactionKind.Upvote) {
    deletedReactionPost.upvotesCount! -= 1;
  } else if (deletedReactionKind === ReactionKind.Downvote) {
    deletedReactionPost.downvotesCount! -= 1;
  }
  deletedReactionPost.reactionsCount! -= 1;

  await ctx.store.save(Post, deletedReactionPost);

  const activity = await setActivity({
    account: accountInst,
    post: deletedReactionPost,
    reaction,
    ctx
  });

  if (!activity) return;
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
  reactionKind: ReactionKindV15;
  ctx: EventHandlerContext;
  createIfNotExists?: boolean;
}): Promise<Reaction | null> {
  const accountInst =
    account instanceof Account
      ? account
      : await ensureAccount(account, ctx, true);
  if (!accountInst) return null;

  const postInst = await ensurePost({
    account,
    postId,
    ctx,
    createIfNotExists: true
  });

  if (!postInst) return null;

  const existingReaction = await ctx.store.get(Reaction, {
    where: { id: reactionId },
    relations: ['post', 'post.createdByAccount', 'post.space']
  });

  if (existingReaction) return existingReaction;

  const newReaction: Reaction = new Reaction();
  newReaction.id = reactionId;
  newReaction.status = Status.Active;
  newReaction.account = accountInst;
  newReaction.post = postInst;
  newReaction.kind = reactionKind as unknown as ReactionKind;
  newReaction.createdAtBlock = BigInt(ctx.event.blockNumber.toString());
  newReaction.createdAtTime = new Date();

  if (createIfNotExists) return ctx.store.save(Reaction, newReaction);
  return newReaction;
}
