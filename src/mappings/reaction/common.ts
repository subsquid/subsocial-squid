import { Account, Post, Reaction, ReactionKind, Status } from '../../model';

import { getOrCreateAccount } from '../account';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { EventData, PostReactionCreatedData } from '../../common/types';
import { Ctx } from '../../processor';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

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

export async function ensureReaction({
  ctx,
  eventData
}: {
  ctx: Ctx;
  eventData: PostReactionCreatedData;
}): Promise<Reaction | null> {
  const accountInst = await getOrCreateAccount(
    eventData.forced && eventData.forcedData
      ? eventData.forcedData.account
      : eventData.accountId,
    ctx
  );

  const postInst = await getEntityWithRelations.post({
    postId: eventData.postId,
    ctx
  });

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
  newReaction.createdAtTime = eventData.timestamp;

  return newReaction;
}
