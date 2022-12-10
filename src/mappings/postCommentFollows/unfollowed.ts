import { EventHandlerContext } from '../../common/contexts';
import { Account, Post, EventName } from '../../model';
import { ensurePositiveOrZeroValue, printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';
import { Ctx } from '../../processor';
import { getOrCreateAccount } from '../account';

export async function postUnfollowed(post: Post, ctx: Ctx): Promise<void> {
  const postUpdated = post;
  const ownerAccount = await getOrCreateAccount(
    post.ownedByAccount.id,
    ctx,
    '634e510f-6d1c-4760-8603-1d96ff27035a'
  );

  await processPostFollowingUnfollowingRelations(
    post,
    ownerAccount,
    EventName.PostUnfollowed,
    ctx
  );

  postUpdated.followersCount = ensurePositiveOrZeroValue(
    postUpdated.followersCount - 1
  );
  ownerAccount.followingPostsCount = ensurePositiveOrZeroValue(
    ownerAccount.followingPostsCount - 1
  );

  await ctx.store.save(postUpdated);
  await ctx.store.save(ownerAccount);
}
