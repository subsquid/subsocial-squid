import { EventHandlerContext } from '../../common/contexts';
import {
  Post,
  Account,
  PostFollowers,
  CommentFollowers,
  EventName
} from '../../model';
import {
  ensurePositiveOrZeroValue,
  getPostFollowersEntityId
} from '../../common/utils';
import { Ctx } from '../../processor';

export const processPostFollowingUnfollowingRelations = async (
  post: Post,
  follower: Account,
  followingEvent: EventName,
  ctx: Ctx
): Promise<void> => {
  const postFollowersEntityId = getPostFollowersEntityId(follower.id, post.id);

  switch (followingEvent) {
    case EventName.PostFollowed:
      if (post.isComment) {
        await ctx.store.save(
          new CommentFollowers({
            id: postFollowersEntityId,
            followerAccount: follower,
            followingComment: post
          })
        );
      } else {
        await ctx.store.save(
          new PostFollowers({
            id: postFollowersEntityId,
            followerAccount: follower,
            followingPost: post
          })
        );
      }
      break;
    case EventName.PostUnfollowed:
      let existingRelation = null;
      if (post.isComment) {
        existingRelation = await ctx.store.get(
          CommentFollowers,
          postFollowersEntityId
        );
        if (existingRelation) await ctx.store.remove(existingRelation);
      } else {
        existingRelation = await ctx.store.get(
          PostFollowers,
          postFollowersEntityId
        );
        if (existingRelation) await ctx.store.remove(existingRelation);
      }
      break;
    default:
  }

  // TODO Check if we need add Activity entity for this "custom" event
};
