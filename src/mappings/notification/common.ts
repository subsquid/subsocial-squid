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
import { Ctx } from '../../processor';

export const addNotificationForAccount = async (
  account: Account | string,
  activity: Activity,
  ctx: Ctx
): Promise<Notification | null> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx, 'dbf0ccab-5307-4495-88fb-c92c2e50580c');

  const notification = new Notification();

  notification.id = getNotificationEntityId(accountInst.id, activity.id);
  notification.account = accountInst;
  notification.activity = activity;

  ctx.store.deferredUpsert(notification);
  return notification;
};

export const addNotificationForAccountFollowers = async (
  account: Account | string,
  activity: Activity,
  ctx: Ctx
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx, 'ec067182-ce7d-49d7-9065-7e53c40eb450');

  const accountFollowersRelations = await ctx.store.find(AccountFollowers, {
    where: { followingAccount: { id: accountInst.id } }
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

  await ctx.store.deferredUpsert(notificationsDraftList);
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
  ctx: Ctx
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx, '0179387a-991c-4956-9db5-e091bb33dea4');

  const relatedNotifications = await ctx.store.find(Notification, {
    where: [
      {
        account: { id: accountInst.id },
        activity: {
          space: { id: followingSpace.id }
        }
      }
    ]
  });

  await ctx.store.deferredRemove(relatedNotifications);
};

export const deleteAllNotificationsAboutAccount = async (
  account: Account | string,
  followingAccount: Account | string,
  ctx: Ctx
): Promise<void> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx, 'f323589c-c261-4013-9cac-c5aa2740efe1');
  const followingAccountInst =
    followingAccount instanceof Account
      ? followingAccount
      : await ensureAccount(followingAccount, ctx, 'd0bf5378-1131-491c-8592-f52bb679d4d5');

  const relatedNotifications = await ctx.store.find(Notification, {
    where: [
      {
        account: { id: accountInst.id },
        activity: {
          account: { id: followingAccountInst.id }
        }
      }
    ]
  });

  await ctx.store.deferredRemove(relatedNotifications);
};
