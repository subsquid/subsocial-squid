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
import { EventHandlerContext } from '../../common/contexts';

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
  ctx: EventHandlerContext
): Promise<void> => {
  const feedItemsMap: Map<string, NewsFeed> = new Map();

  const accountFollowers = await ctx.store.find(AccountFollowers, {
    where: { followingAccount: { id: post.createdByAccount.id } },
    relations: { followerAccount: true }
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
        (follower) =>
          follower.followerAccount.id !== post.ownedByAccount.id &&
          follower.followerAccount.id !== post.createdByAccount.id
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
  account: Account,
  space: Space,
  ctx: EventHandlerContext
): Promise<void> => {
  const relatedFeedItems = await ctx.store.find(NewsFeed, {
    where: [
      {
        account: { id: account.id },
        activity: {
          space: { id: space.id },
          event: EventName.PostCreated
        }
      },
      {
        account: { id: account.id },
        activity: {
          space: { id: space.id },
          event: EventName.PostMoved
        }
      }
    ],
    relations: {
      activity: {
        space: true
      }
    }
  });

  await ctx.store.remove<NewsFeed>(relatedFeedItems);
};

export const deleteAccountPostsFromFeedForAccount = async (
  account: Account,
  publisherAccount: Account,
  ctx: EventHandlerContext
): Promise<void> => {
  const feedsForDelete = await ctx.store.find(NewsFeed, {
    where: {
      account: { id: account.id },
      activity: {
        account: { id: publisherAccount.id },
        event: EventName.PostCreated
      }
    },
    relations: { activity: { account: true } }
  });

  await ctx.store.remove<NewsFeed>(feedsForDelete);
};
