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
    where: { followingAccount: post.createdByAccount },
    relations: ['followerAccount']
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

  const spaceFollowers = await ctx.store.find(SpaceFollowers, {
    where: { followingSpace: post.space },
    relations: ['followerAccount']
  });

  spaceFollowers.forEach(({ followerAccount }) => {
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
        account,
        activity: {
          space,
          event: EventName.PostCreated
        }
      },
      {
        account,
        activity: {
          space,
          event: EventName.PostMoved
        }
      }
    ],
    relations: ['activity', 'activity.space']
  });

  await ctx.store.remove<NewsFeed>(relatedFeedItems);
};

export const deleteAccountPostsFromFeedForAccount = async (
  account: Account,
  publisherAccount: Account,
  ctx: EventHandlerContext
): Promise<void> => {
  const feedsForDelete = await ctx.store.find(NewsFeed, {
    where: [
      {
        account,
        activity: {
          account: publisherAccount,
          event: EventName.PostCreated
        }
      }
    ],
    relations: ['activity', 'activity.account']
  });

  await ctx.store.remove<NewsFeed>(feedsForDelete);
};
