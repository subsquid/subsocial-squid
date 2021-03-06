import { resolvePost } from '../../connection/resolvers/resolvePostData';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post, Account } from '../../model';
import { PostsPostUpdatedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { updatePostsCountersInSpace } from '../space';
import { setActivity } from '../activity';
import {
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { SpaceCountersAction } from '../../common/types';

export async function postUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new PostsPostUpdatedEvent(ctx);
  printEventLog(ctx);

  const [accountId, id] = event.asV1;

  const post = await ctx.store.get(Post, {
    where: { id: id.toString() },
    relations: [
      'space',
      'createdByAccount',
      'rootPost',
      'parentPost',
      'rootPost.createdByAccount',
      'parentPost.createdByAccount',
      'space.ownerAccount',
      'space.createdByAccount'
    ]
  });
  if (!post) {
    new EntityProvideFailWarning(Post, id.toString(), ctx);
    return;
  }

  const prevVisStateHidden = post.hidden;

  const postData = await resolvePost(id as unknown as PostId);
  if (!postData) {
    new MissingSubsocialApiEntity('PostWithSomeDetails', ctx);
    return;
  }

  const { struct: postStruct, content: postContent } = postData.post;

  if (post.updatedAtTime === postStruct.updatedAtTime) return;

  const createdByAccount = await ensureAccount(
    postStruct.createdByAccount,
    ctx
  );

  post.hidden = postStruct.hidden;
  post.createdByAccount = createdByAccount;
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
    space: post.space,
    post,
    isPrevVisStateHidden: prevVisStateHidden,
    action: SpaceCountersAction.PostUpdated,
    ctx
  });

  await setActivity({
    account: addressSs58ToString(accountId),
    post,
    ctx
  });
}
