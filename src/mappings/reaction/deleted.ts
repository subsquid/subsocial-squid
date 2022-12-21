import {
  ReactionKind,
  Status,
  Post,
  Reaction,
  Activity,
  EventName
} from '../../model';
import { Ctx } from '../../processor';

import { setActivity } from '../activity';
import { addNotificationForAccount } from '../notification';
import { getOrCreateAccount } from '../account';
import { getSyntheticEventName } from '../../common/utils';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { PostReactionDeletedData } from '../../common/types';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

export async function postReactionDeleted(
  ctx: Ctx,
  eventData: PostReactionDeletedData
): Promise<void> {
  const { forced, forcedData, postId, reactionId, reactionKind } = eventData;

  const reaction = await ctx.store.get(Reaction, reactionId);

  if (!reaction) {
    new EntityProvideFailWarning(Reaction, reactionId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const post = await getEntityWithRelations.post({ postId, ctx });

  if (!post) {
    new EntityProvideFailWarning(Reaction, postId, ctx, eventData);
    throw new CommonCriticalError();
  }

  reaction.status = Status.Deleted;

  await ctx.store.save(reaction);

  if (reactionKind === ReactionKind.Upvote) {
    post.upvotesCount! -= 1;
  } else if (reactionKind === ReactionKind.Downvote) {
    post.downvotesCount! -= 1;
  }
  post.reactionsCount! -= 1;

  await ctx.store.save(post);

  const accountInst = await getOrCreateAccount(
    forced && forcedData
      ? forcedData.account
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
  await addNotificationForAccount(post.ownedByAccount, activity, ctx);
}
