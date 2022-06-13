import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account, Activity, NewsFeed } from '../model';

export const addNewsFeed = async (
  account: Account,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<NewsFeed> => {
  const newsFeed = new NewsFeed();

  newsFeed.id = `${account.id}-${activity.id}`;
  newsFeed.account = account;
  newsFeed.activity = activity;

  return ctx.store.save<NewsFeed>(newsFeed);
};
