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
  const accountFollowers = await ctx.store.find(AccountFollowers, {
    where: { followingAccount: post.createdByAccount },
    relations: ['followerAccount']
  });

  const spaceFollowers = await ctx.store.find(SpaceFollowers, {
    where: { followingSpace: post.space },
    relations: ['followerAccount']
  });

  const followers: [string, Account][] = [
    ...accountFollowers,
    ...spaceFollowers
  ].map((relation: AccountFollowers | SpaceFollowers) => [
    relation.followerAccount.id,
    relation.followerAccount as unknown as Account
  ]);

  const filteredFollowersMap: Map<string, Account> = new Map<string, Account>(
    followers
  );

  const feedItemsList: NewsFeed[] = [];

  filteredFollowersMap.forEach((account: Account) => {
    const newFeedItem = new NewsFeed({
      id: getNewsFeedEntityId(account.id, activity.id),
      account,
      activity
    });
    feedItemsList.push(newFeedItem);
  });

  await ctx.store.save<NewsFeed>(feedItemsList);
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
