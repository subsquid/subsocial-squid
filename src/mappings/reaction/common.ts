import assert from 'assert';
import { Account, Post, Reaction, ReactionKind, Status } from '../../model';
import {
  ReactionsCreatePostReactionCall,
  ReactionsUpdatePostReactionCall
} from '../../types/generated/calls';

import { ensureAccount } from '../account';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { EventData, PostReactionCreatedData } from '../../common/types';
import { Ctx } from '../../processor';

export function getReactionKindFromCall(
  eventName: string,
  ctx: EventHandlerContext
): ReactionKind | null {
  // assert(ctx.event.call);
  //
  // let call = null;
  // let kind = null;
  // switch (eventName) {
  //   case 'Reactions.PostReactionCreated':
  //     call = new ReactionsCreatePostReactionCall({
  //       _chain: ctx._chain,
  //       call: ctx.event.call
  //     });
  //     kind = call.asV1.kind;
  //     break;
  //   case 'Reactions.PostReactionUpdated':
  //     call = new ReactionsUpdatePostReactionCall({
  //       _chain: ctx._chain,
  //       call: ctx.event.call
  //     });
  //     kind = call.asV1.newKind;
  //     break;
  // }
  //
  // if (!call || !kind) return null;
  //
  // return ReactionKind[kind.__kind as keyof typeof ReactionKind];
  return null;
}

// export async function getReactionKindFromSquidDb(
//   reactionId: string,
//   ctx: EventHandlerContext
// ): Promise<ReactionKind | null> {
//   const reaction = await ctx.store.get(Reaction, reactionId);
//   // if (!reaction) {
//   //   new EntityProvideFailWarning(Reaction, reactionId, ctx, eventData);
//   //   return null;
//   // }
//   return ReactionKind[reaction.kind];
// }

export async function ensureReaction({
  ctx,
  eventData
}: {
  ctx: Ctx;
  eventData: PostReactionCreatedData;
}): Promise<Reaction | null> {
  const accountInst = await ensureAccount(
    eventData.forced && eventData.forcedData
      ? eventData.forcedData.account
      : eventData.accountId,
    ctx
  );

  const postInst = await ctx.store.get(Post, eventData.postId, false);

  if (!postInst) {
    new EntityProvideFailWarning(Post, eventData.postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const newReaction = new Reaction();
  newReaction.id = eventData.reactionId;
  newReaction.status = Status.Active;
  newReaction.account = accountInst;
  newReaction.post = postInst;
  newReaction.kind = eventData.reactionKind;
  newReaction.createdAtBlock = BigInt(eventData.blockNumber.toString());
  newReaction.createdAtTime = new Date(eventData.timestamp);

  return newReaction;
}
//
// export async function ensureReaction({
//   account,
//   postId,
//   reactionId,
//   reactionKind,
//   ctx,
//   createIfNotExists = false,
//   eventData
// }: {
//   account: Account | string;
//   postId: string;
//   reactionId: string;
//   reactionKind: ReactionKind;
//   ctx: EventHandlerContext;
//   createIfNotExists?: boolean;
//   eventData: EventData;
// }): Promise<Reaction | null> {
//   const existingReaction = await ctx.store.get(Reaction, {
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
//       }
//     }
//   });
//
//   if (existingReaction) return existingReaction;
//
//   const accountInst =
//     // @ts-ignore
//     account instanceof Account ? account : await ensureAccount(account, ctx);
//
//   const postInst = await ctx.store.get(Post, {
//     where: { id: postId },
//     relations: {
//       ownedByAccount: true,
//       space: true,
//       parentPost: {
//         ownedByAccount: true
//       },
//       rootPost: {
//         ownedByAccount: true
//       }
//     }
//   });
//
//   if (!postInst) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Post, postId, ctx);
//     new CommonCriticalError();
//     return null;
//   }
//
//   const newReaction = new Reaction();
//   newReaction.id = reactionId;
//   newReaction.status = Status.Active;
//   newReaction.account = accountInst;
//   newReaction.post = postInst;
//   newReaction.kind = reactionKind;
//   newReaction.createdAtBlock = BigInt(ctx.block.height.toString());
//   newReaction.createdAtTime = new Date(ctx.block.timestamp);
//
//   if (createIfNotExists) await ctx.store.save<Reaction>(newReaction);
//   return newReaction;
// }
