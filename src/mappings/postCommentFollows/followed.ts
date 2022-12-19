import { Post, Account, EventName } from '../../model';
import { processPostFollowingUnfollowingRelations } from './common';
import { Ctx } from '../../processor';
import { getOrCreateAccount } from '../account';

export async function postFollowed(post: Post, ctx: Ctx): Promise<void> {
  const postUpdated = post;
  const ownerAccount = await getOrCreateAccount(
    post.ownedByAccount.id,
    ctx,
    '3ed806b4-871b-43a5-a1f4-a2e9bdec7a7e'
  );

  await processPostFollowingUnfollowingRelations(
    post,
    ownerAccount,
    EventName.PostFollowed,
    ctx
  );

  postUpdated.followersCount += 1;
  ownerAccount.followingPostsCount += 1;

  await ctx.store.save(postUpdated);
  await ctx.store.save(ownerAccount);
}
