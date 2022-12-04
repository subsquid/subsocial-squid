import { EventHandlerContext } from '../../common/contexts';
import { Post, Account, EventName } from '../../model';
import { printEventLog } from '../../common/utils';
import { processPostFollowingUnfollowingRelations } from './common';
import { PostCreatedData } from "../../common/types";
import { Ctx } from '../../processor';
import { ensureAccount } from "../account";

export async function postFollowed(
  post: Post,
  ctx: Ctx,
): Promise<void> {

  const postUpdated = post;
  const ownerAccount = await ensureAccount(post.ownedByAccount.id, ctx);

  await processPostFollowingUnfollowingRelations(
    post,
    ownerAccount,
    EventName.PostFollowed,
    ctx
  );


  postUpdated.followersCount += 1;
  ownerAccount.followingPostsCount += 1;

  ctx.store.deferredUpsert(postUpdated);
  ctx.store.deferredUpsert(ownerAccount);
}
