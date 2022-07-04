import { EventHandlerContext } from '../../common/contexts';
import { Post } from '../../model';
import { printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowing } from './common';

export async function postFollowed(
  post: Post,
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  await processPostFollowingUnfollowing(post, post.createdByAccount, ctx);
}
