import { EventHandlerContext } from '../../common/contexts';
import { Post, Account, PostFollowers, CommentFollowers } from '../../model';
import {
  ensurePositiveOrZeroValue,
  getPostFollowersEntityId
} from '../../common/utils';
import { PostFollowingUnfollowingCustomEvents } from '../../common/types';

export const processPostFollowingUnfollowingRelations = async (
  post: Post,
  follower: Account,
  followingEvent: PostFollowingUnfollowingCustomEvents,
  ctx: EventHandlerContext
): Promise<void> => {
  const postFollowersEntityId = getPostFollowersEntityId(follower.id, post.id);

  switch (followingEvent) {
    case PostFollowingUnfollowingCustomEvents.PostFollowed:
      if (post.isComment) {
        const newCommentFollowersEnt = new CommentFollowers();
        newCommentFollowersEnt.id = postFollowersEntityId;
        newCommentFollowersEnt.followerAccount = follower;
        newCommentFollowersEnt.followingComment = post;
        await ctx.store.save<CommentFollowers>(newCommentFollowersEnt);
      } else {
        const newPostFollowersEnt = new PostFollowers();
        newPostFollowersEnt.id = postFollowersEntityId;
        newPostFollowersEnt.followerAccount = follower;
        newPostFollowersEnt.followingPost = post;
        await ctx.store.save<PostFollowers>(newPostFollowersEnt);
      }
      break;
    case PostFollowingUnfollowingCustomEvents.PostUnfollowed:
      let existingRelation = null;
      if (post.isComment) {
        existingRelation = await ctx.store.get(
          CommentFollowers,
          postFollowersEntityId
        );
        if (existingRelation)
          await ctx.store.remove<CommentFollowers>(existingRelation);
      } else {
        existingRelation = await ctx.store.get(
          PostFollowers,
          postFollowersEntityId
        );
        if (existingRelation)
          await ctx.store.remove<PostFollowers>(existingRelation);
      }
      break;
    default:
  }

  // TODO Check if we need add Activity entity for this "custom" event
};
