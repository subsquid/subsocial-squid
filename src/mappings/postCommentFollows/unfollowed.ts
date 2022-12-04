import { EventHandlerContext } from '../../common/contexts';
import { Account, Post, EventName } from '../../model';
import { ensurePositiveOrZeroValue, printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';
import { Ctx } from '../../processor';
import { ensureAccount } from '../account';

export async function postUnfollowed(post: Post, ctx: Ctx): Promise<void> {
  const postUpdated = post;
  const ownerAccount = await ensureAccount(post.ownedByAccount.id, ctx);

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

  await ctx.store.deferredUpsert(postUpdated);
  await ctx.store.deferredUpsert(ownerAccount);
}
