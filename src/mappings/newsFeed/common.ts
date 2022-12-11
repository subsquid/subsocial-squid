import {
  Account,
  Activity,
  NewsFeed,
  Space,
  Post,
  AccountFollowers,
  SpaceFollowers,
  EventName
} from '../../model';
import { getNewsFeedEntityId } from '../../common/utils';
import { Ctx } from '../../processor';
import { getOrCreateAccount } from '../account';

/**
 * Add Post to NewsFeed for all Account's and Space's followers.
 *
 * @param post
 * @param activity
 * @param ctx
 */
export const addPostToFeeds = async (
  post: Post,
  activity: Activity,
  ctx: Ctx
): Promise<void> => {
  const feedItemsMap: Map<string, NewsFeed> = new Map();

  const accountFollowers = await ctx.store.find(AccountFollowers, {
    where: {
      followingAccount: {
        id: post.ownedByAccount.id
      }
    }
  });

  accountFollowers.forEach(({ followerAccount }) => {
    const id = getNewsFeedEntityId(followerAccount.id, activity.id);
    feedItemsMap.set(
      id,
      new NewsFeed({
        account: followerAccount,
        id,
        activity
      })
    );
  });

  if (post.space) {
    const spaceFollowers = await ctx.store.find(SpaceFollowers, {
      where: { followingSpace: { id: post.space.id } },
      relations: { followerAccount: true }
    });

    spaceFollowers
      .filter(
        (follower) => follower.followerAccount.id !== post.ownedByAccount.id
      )
      .forEach(({ followerAccount }) => {
        const id = getNewsFeedEntityId(followerAccount.id, activity.id);
        feedItemsMap.set(
          id,
          new NewsFeed({
            account: followerAccount,
            id,
            activity
          })
        );
      });
  }

  await ctx.store.save([...feedItemsMap.values()]);
};

export const deleteSpacePostsFromFeedForAccount = async (
  accountId: string,
  space: Space,
  ctx: Ctx
): Promise<void> => {
  const relatedFeedItems = await ctx.store.find(NewsFeed, {
    where: [
      {
        account: { id: accountId },
        activity: {
          space: { id: space.id },
          event: EventName.PostCreated
        }
      },
      {
        account: { id: accountId },
        activity: {
          space: { id: space.id },
          event: EventName.PostMoved
        }
      }
    ]
  });

  await ctx.store.remove(relatedFeedItems);
};

export const deleteAccountPostsFromFeedForAccount = async (
  account: Account,
  publisherAccount: Account,
  ctx: Ctx
): Promise<void> => {
  const feedsForDelete = await ctx.store.find(NewsFeed, {
    where: {
      account: { id: account.id },
      activity: {
        account: { id: publisherAccount.id },
        event: EventName.PostCreated
      }
    }
  });

  await ctx.store.remove(feedsForDelete);
};
