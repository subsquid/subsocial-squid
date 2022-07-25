import {
  Account,
  Activity,
  NewsFeed,
  Notification,
  Space,
  AccountFollowers
} from '../../model';
import { ensureAccount } from '../account';
import { getNotificationEntityId } from '../../common/utils';
import { EventHandlerContext } from '../../common/contexts';

export const addNotificationForAccount = async (
  account: Account | string,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<Notification | null> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);

  const notification = new Notification();

  notification.id = getNotificationEntityId(accountInst.id, activity.id);
  notification.account = accountInst;
  notification.activity = activity;

  await ctx.store.save<Notification>(notification);
  return notification;
};

export const addNotificationForAccountFollowers = async (
  account: Account | string,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);

  const accountFollowersRelations = await ctx.store.find(AccountFollowers, {
    where: { followingAccount: accountInst },
    relations: ['followerAccount']
  });

  const notificationsDraftList = accountFollowersRelations.map(
    (relation: AccountFollowers) => {
      const notification = new Notification();

      notification.id = getNotificationEntityId(
        relation.followerAccount.id,
        activity.id
      );
      notification.account = relation.followerAccount;
      notification.activity = activity;

      return notification;
    }
  );

  if (!notificationsDraftList || notificationsDraftList.length === 0) return;

  await ctx.store.save<Notification>(notificationsDraftList);
};

/**
 * Delete all notifications about Space activities and Space's posts activities
 * @param account
 * @param followingSpace
 * @param ctx
 */
export const deleteAllNotificationsAboutSpace = async (
  account: Account | string,
  followingSpace: Space,
  ctx: EventHandlerContext
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);

  const relatedNotifications = await ctx.store.find(Notification, {
    where: [
      {
        account,
        activity: {
          space: followingSpace
        }
      }
    ],
    relations: ['activity', 'activity.space']
  });

  await ctx.store.remove<NewsFeed>(relatedNotifications);
};

export const deleteAllNotificationsAboutAccount = async (
  account: Account | string,
  followingAccount: Account | string,
  ctx: EventHandlerContext
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  const followingAccountInst =
    followingAccount instanceof Account
      ? followingAccount
      : await ensureAccount(followingAccount, ctx);

  const relatedNotifications = await ctx.store.find(Notification, {
    where: [
      {
        account: accountInst,
        activity: {
          account: followingAccountInst
        }
      }
    ],
    relations: ['activity', 'activity.account']
  });

  await ctx.store.remove<NewsFeed>(relatedNotifications);
};
