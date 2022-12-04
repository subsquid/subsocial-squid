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

export async function getReactionKindFromSquidDb(
  reactionId: string,
  ctx: EventHandlerContext
): Promise<ReactionKind | null> {
  const reaction = await ctx.store.get(Reaction, reactionId);
  if (!reaction) {
    // @ts-ignore
    new EntityProvideFailWarning(Reaction, reactionId, ctx);
    return null;
  }
  return ReactionKind[reaction.kind];
}

export async function ensureReaction({
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
    relations: {
      post: {
        ownedByAccount: true,
        space: true,
        parentPost: {
          ownedByAccount: true
        },
        rootPost: {
          ownedByAccount: true
        }
      }
    }
  });
  if (existingReaction) return existingReaction;

  const accountInst =
    // @ts-ignore
    account instanceof Account ? account : await ensureAccount(account, ctx);

  const postInst = await ctx.store.get(Post, {
    where: { id: postId },
    relations: {
      ownedByAccount: true,
      space: true,
      parentPost: {
        ownedByAccount: true
      },
      rootPost: {
        ownedByAccount: true
      }
    }
  });

  if (!postInst) {
    // @ts-ignore
    new EntityProvideFailWarning(Post, postId, ctx);
    new CommonCriticalError();
    return null;
  }

  const newReaction = new Reaction();
  newReaction.id = reactionId;
  newReaction.status = Status.Active;
  newReaction.account = accountInst;
  newReaction.post = postInst;
  newReaction.kind = reactionKind;
  newReaction.createdAtBlock = BigInt(ctx.block.height.toString());
  newReaction.createdAtTime = new Date(ctx.block.timestamp);

  if (createIfNotExists) await ctx.store.save<Reaction>(newReaction);
  return newReaction;
}
