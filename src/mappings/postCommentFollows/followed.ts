import { EventHandlerContext } from '../../common/contexts';
import { Post, Account, EventName } from '../../model';
import { printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';

export async function postFollowed(
  post: Post,
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  await processPostFollowingUnfollowingRelations(
    post,
    post.ownedByAccount,
    EventName.PostFollowed,
    ctx
  );

  const postUpdated = post;
  const accountUpdated = post.ownedByAccount;
  postUpdated.followersCount += 1;
  accountUpdated.followingPostsCount += 1;

  await ctx.store.save<Post>(postUpdated);
  await ctx.store.save<Account>(accountUpdated);
}
