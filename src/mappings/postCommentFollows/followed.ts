import { EventHandlerContext } from '../../common/contexts';
import { Post, Account } from '../../model';
import { printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';
import { PostFollowingUnfollowingCustomEvents } from '../../common/types';

export async function postFollowed(
  post: Post,
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  await processPostFollowingUnfollowingRelations(
    post,
    post.ownedByAccount,
    PostFollowingUnfollowingCustomEvents.PostFollowed,
    ctx
  );

  const postUpdated = post;
  const accountUpdated = post.ownedByAccount;
  postUpdated.followersCount += 1;
  accountUpdated.followingPostsCount += 1;

  await ctx.store.save<Post>(postUpdated);
  await ctx.store.save<Account>(accountUpdated);
}
