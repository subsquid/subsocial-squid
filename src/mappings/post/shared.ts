import { resolvePostStruct } from '../../connection/resolvers/resolvePostData';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post, Account, Activity } from '../../model';
// import { PostsPostSharedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import {
  addNotificationForAccount,
  addNotificationForAccountFollowers
} from '../notification';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

export async function postShared(ctx: EventHandlerContext): Promise<void> {
  // printEventLog(ctx);
  //
  // const event = new PostsPostSharedEvent(ctx);
  //
  // const [accountId, id] = event.asV1;
  // const account = await ensureAccount(addressSs58ToString(accountId), ctx);
  //
  // const post = await ctx.store.get(Post, {
  //   where: { id: id.toString() },
  //   relations: {
  //     createdByAccount: true,
  //     parentPost: { createdByAccount: true },
  //     rootPost: { createdByAccount: true },
  //     space: { ownerAccount: true, createdByAccount: true }
  //   }
  // });
  // if (!post) {
  //   new EntityProvideFailWarning(Post, id.toString(), ctx);
  //   throw new CommonCriticalError();
  //   return;
  // }
  //
  // post.sharesCount += 1;
  //
  // await ctx.store.save<Post>(post);
  //
  // const activity = await setActivity({
  //   account,
  //   post,
  //   ctx
  // });
  //
  // if (!activity) {
  //   new EntityProvideFailWarning(Activity, 'new', ctx);
  //   throw new CommonCriticalError();
  //   return;
  // }
  //
  // if (!post.isComment || (post.isComment && !post.parentPost)) {
  //   await addNotificationForAccountFollowers(account, activity, ctx);
  //   await addNotificationForAccount(account, activity, ctx);
  // } else if (post.isComment && post.parentPost && post.rootPost) {
  //   /**
  //    * Notifications should not be added for creator followers if post is reply
  //    */
  //   await addNotificationForAccount(
  //     post.rootPost.createdByAccount,
  //     activity,
  //     ctx
  //   );
  //   await addNotificationForAccount(
  //     post.parentPost.createdByAccount,
  //     activity,
  //     ctx
  //   );
  // }
}
