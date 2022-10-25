import { EventHandlerContext } from '../../common/contexts';
import { Account, Post, EventName } from '../../model';
import { ensurePositiveOrZeroValue, printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';

export async function postUnfollowed(
  post: Post,
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  await processPostFollowingUnfollowingRelations(
    post,
    post.ownedByAccount,
    EventName.PostUnfollowed,
    ctx
  );

  const postUpdated = post;
  const accountUpdated = post.ownedByAccount;
  postUpdated.followersCount = ensurePositiveOrZeroValue(
    postUpdated.followersCount - 1
  );
  accountUpdated.followingPostsCount = ensurePositiveOrZeroValue(
    accountUpdated.followingPostsCount - 1
  );

  await ctx.store.save<Post>(postUpdated);
  await ctx.store.save<Account>(accountUpdated);
}
