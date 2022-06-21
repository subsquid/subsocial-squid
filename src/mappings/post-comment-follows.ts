import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Post, Account, PostFollowers, CommentFollowers } from '../model';
import { getPostFollowersEntityId, printEventLog } from './utils';

export async function postFollowed(
  post: Post,
  ctx: EventHandlerContext
): Promise<void> {
  printEventLog(ctx);

  await processPostFollowingUnfollowing(post, post.createdByAccount, ctx);
}

const processPostFollowingUnfollowing = async (
  post: Post,
  follower: Account,
  ctx: EventHandlerContext
): Promise<void> => {
  if (!post) return;

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
  post.followersCount = (post.followersCount || 0) + 1;
  await ctx.store.save<Post>(post);
  // TODO Check if we need add Activity entity for this "custom" event
};
