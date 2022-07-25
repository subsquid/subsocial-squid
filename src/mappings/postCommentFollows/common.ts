import { EventHandlerContext } from '../../common/contexts';
import { Post, Account, PostFollowers, CommentFollowers } from '../../model';
import { getPostFollowersEntityId } from '../../common/utils';

export const processPostFollowingUnfollowing = async (
  post: Post,
  follower: Account,
  ctx: EventHandlerContext
): Promise<void> => {
  const postFollowersEntityId = getPostFollowersEntityId(follower.id, post.id);

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
  post.followersCount += 1;
  await ctx.store.save<Post>(post);
  // TODO Check if we need add Activity entity for this "custom" event
};
