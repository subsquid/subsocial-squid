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
import { Ctx } from '../../processor';
import { PostReactionUpdatedData } from '../../common/types';

export async function postReactionUpdated(
  ctx: Ctx,
  eventData: PostReactionUpdatedData
): Promise<void> {
  const {
    accountId,
    reactionId,
    postId,
    newReactionKind,
    timestamp,
    blockNumber
  } = eventData;

  const account = await ensureAccount(accountId, ctx);

  const reaction = await ctx.store.get(Reaction, reactionId, false);

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx, eventData);
    throw new CommonCriticalError();
  }

  reaction.kind = newReactionKind;
  reaction.updatedAtTime = timestamp;
  reaction.updatedAtBlock = BigInt(blockNumber.toString());

  await ctx.store.deferredUpsert(reaction);

  const post = await ctx.store.get(Post, postId, false);

  if (!post) {
    new EntityProvideFailWarning(Post, postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  if (reaction.kind === ReactionKind.Upvote) {
    post.upvotesCount += 1;
    post.downvotesCount = ensurePositiveOrZeroValue(post.downvotesCount - 1);
  } else if (reaction.kind === ReactionKind.Downvote) {
    post.downvotesCount += 1;
    post.upvotesCount = ensurePositiveOrZeroValue(post.upvotesCount - 1);
  }

  await ctx.store.deferredUpsert(post);

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(
      EventName.PostReactionCreated,
      post
    ),
    account,
    reaction,
    post,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }
  await addNotificationForAccount(post.ownedByAccount, activity, ctx);
}

//
// export async function postReactionUpdated(
//   ctx: Ctx,
//   eventData: PostReactionUpdatedData
// ): Promise<void> {
//
//   const { accountId, reactionId, postId, newReactionKind } = eventData;
//
//   const account = await ensureAccount(accountId, ctx);
//
//   const reaction = await ctx.store.get(Reaction, {
//     where: { id: reactionId },
//     relations: {
//       post: {
//         ownedByAccount: true,
//         space: true,
//         parentPost: {
//           ownedByAccount: true
//         },
//         rootPost: {
//           ownedByAccount: true
//         }
//       },
//       account: true
//     }
//   });
//
//   if (!reaction) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Reaction, reactionId, ctx);
//     throw new CommonCriticalError();
//   }
//
//   reaction.kind = reactionKind as unknown as ReactionKind;
//   reaction.updatedAtTime = new Date(ctx.block.timestamp);
//   reaction.updatedAtBlock = BigInt(ctx.block.height.toString());
//   await ctx.store.save<Reaction>(reaction);
//
//   const { post } = reaction;
//
//   if (reaction.kind === ReactionKind.Upvote) {
//     post.upvotesCount += 1;
//     post.downvotesCount = ensurePositiveOrZeroValue(post.downvotesCount - 1);
//   } else if (reaction.kind === ReactionKind.Downvote) {
//     post.downvotesCount += 1;
//     post.upvotesCount = ensurePositiveOrZeroValue(post.upvotesCount - 1);
//   }
//
//   await ctx.store.save<Post>(post);
//
//   const activity = await setActivity({
//     syntheticEventName: getSyntheticEventName(
//       EventName.PostReactionCreated,
//       post
//     ),
//     account,
//     reaction,
//     post,
//     ctx
//   });
//
//   if (!activity) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Activity, 'new', ctx);
//     throw new CommonCriticalError();
//   }
//   await addNotificationForAccount(reaction.post.ownedByAccount, activity, ctx);
// }
