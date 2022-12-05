import {
  ReactionKind,
  Status,
  Post,
  Reaction,
  Activity,
  EventName
} from '../../model';
import { ReactionsPostReactionDeletedEvent } from '../../types/generated/events';
import { Ctx } from '../../processor';

import { setActivity } from '../activity';
import { addNotificationForAccount } from '../notification';
import { ensureAccount } from '../account';
import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  UnknownVersionError
} from '../../common/errors';
// import { getReactionKindFromSquidDb } from './common';
import { PostReactionDeletedData } from '../../common/types';

export async function postReactionDeleted(
  ctx: Ctx,
  eventData: PostReactionDeletedData
): Promise<void> {
  const { forced, forcedData, postId, reactionId, reactionKind } = eventData;

  const reaction = await ctx.store.get(Reaction, reactionId, false);

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const post = await ctx.store.get(Post, postId, false);

  if (!post) {
    new EntityProvideFailWarning(Reaction, postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  reaction.status = Status.Deleted;

  ctx.store.deferredUpsert(reaction);

  if (reactionKind === ReactionKind.Upvote) {
    post.upvotesCount! -= 1;
  } else if (reactionKind === ReactionKind.Downvote) {
    post.downvotesCount! -= 1;
  }
  post.reactionsCount! -= 1;

  await ctx.store.deferredUpsert(post);

  const accountInst = await ensureAccount(
    eventData.forced && eventData.forcedData
      ? eventData.forcedData.account
      : eventData.accountId,
    ctx
  );

  const activity = await setActivity({
    syntheticEventName: getSyntheticEventName(
      EventName.PostReactionCreated,
      post
    ),
    account: accountInst,
    post,
    reaction,
    ctx,
    eventData
  });

  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    throw new CommonCriticalError();
  }
  // TODO - add implementation
  // await addNotificationForAccount(
  //   deletedReactionPost.ownedByAccount,
  //   activity,
  //   ctx
  // );
}

//
//
//
// async function getPostReactionDeletedEvent(
//   ctx: EventHandlerContext
// ): Promise<ReactionEvent | null> {
//   const event = new ReactionsPostReactionDeletedEvent(ctx);
//   const { account: accountId, postId, reactionId, reactionKind } = event.asV13;
//   return {
//     accountId: addressSs58ToString(accountId),
//     postId: postId.toString(),
//     reactionId: reactionId.toString(),
//     reactionKind: ReactionKind[reactionKind.__kind]
//   };
//   throw new UnknownVersionError(event.constructor.name);
// }
//
// export async function postReactionDeleted(
//   ctx: EventHandlerContext
// ): Promise<void> {
//   printEventLog(ctx);
//   const event = await getPostReactionDeletedEvent(ctx);
//   if (!event) return;
//
//   const { accountId, reactionId } = event;
//
//   // @ts-ignore
//   const accountInst = await ensureAccount(accountId, ctx);
//
//   const reaction = await ctx.store.get(Reaction, {
//     where: { id: reactionId },
//     relations: {
//       account: true,
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
//   if (!reaction) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Reaction, reactionId, ctx);
//     throw new CommonCriticalError();
//   }
//
//   const { kind: deletedReactionKind, post: deletedReactionPost } = reaction;
//
//   reaction.status = Status.Deleted;
//   await ctx.store.save<Reaction>(reaction);
//
//   if (deletedReactionKind === ReactionKind.Upvote) {
//     deletedReactionPost.upvotesCount! -= 1;
//   } else if (deletedReactionKind === ReactionKind.Downvote) {
//     deletedReactionPost.downvotesCount! -= 1;
//   }
//   deletedReactionPost.reactionsCount! -= 1;
//
//   await ctx.store.save<Post>(deletedReactionPost);
//
//   const activity = await setActivity({
//     syntheticEventName: getSyntheticEventName(
//       EventName.PostReactionCreated,
//       deletedReactionPost
//     ),
//     account: accountInst,
//     post: deletedReactionPost,
//     reaction,
//     ctx
//   });
//
//   if (!activity) {
//     // @ts-ignore
//     new EntityProvideFailWarning(Activity, 'new', ctx);
//     throw new CommonCriticalError();
//   }
//   await addNotificationForAccount(
//     deletedReactionPost.ownedByAccount,
//     activity,
//     ctx
//   );
// }
