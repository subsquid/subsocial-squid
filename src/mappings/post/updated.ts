import { resolvePost } from '../../connection/resolvers/resolvePostData';
import {
  addressSs58ToString,
  getSyntheticEventName,
  printEventLog
} from '../../common/utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post, Account, EventName } from '../../model';
import { PostsPostUpdatedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { SpaceCountersAction } from '../../common/types';

export async function postUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostUpdatedEvent(ctx);
  printEventLog(ctx);

  const { account: accountId, postId } = event.asV13;

  const post = await ctx.store.get(Post, {
    where: { id: postId.toString() },
    relations: {
      ownedByAccount: true,
      rootPost: { ownedByAccount: true },
      parentPost: { ownedByAccount: true },
      space: { ownedByAccount: true }
    }
  });
  if (!post) {
    new EntityProvideFailWarning(Post, postId.toString(), ctx);
    throw new CommonCriticalError();
    return;
  }

  const prevVisStateHidden = post.hidden;

  const postData = await resolvePost(postId as unknown as PostId);
  if (!postData) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    return;
  }

  const { struct: postStruct, content: postContent } = postData.post;

  if (post.updatedAtTime === postStruct.updatedAtTime) return;

  const ownedByAccount = await ensureAccount(postStruct.ownerId, ctx);

  post.hidden = postStruct.hidden;
  post.ownedByAccount = ownedByAccount;
  post.content = postStruct.contentId;
  post.updatedAtTime = postStruct.updatedAtTime
    ? new Date(postStruct.updatedAtTime)
    : null;

  if (postContent) {
    post.title = postContent.title;
    post.image = postContent.image;
    post.summary = postContent.summary;
    post.slug = null;
    post.tagsOriginal = postContent.tags?.join(',');
  }

  await ctx.store.save<Post>(post);

  await updatePostsCountersInSpace({
    space: post.space || null,
    post,
    isPrevVisStateHidden: prevVisStateHidden,
    action: SpaceCountersAction.PostUpdated,
    ctx
  });

  await setActivity({
    syntheticEventName: getSyntheticEventName(EventName.PostUpdated, post),
    account: addressSs58ToString(accountId),
    post,
    ctx
  });
}
