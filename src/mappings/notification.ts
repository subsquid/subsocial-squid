import { EventHandlerContext } from '@subsquid/substrate-processor';
import { Account, Activity, Notification } from '../model';
import { ensureAccount } from './account';

export const addNotification = async (
  account: Account | string,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<Notification | null> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) return null;

  const notification = new Notification();

  notification.id = `${accountInst.id}-${activity.id}`;
  notification.account = accountInst;
  notification.activity = activity;

  return ctx.store.save<Notification>(notification);
};

export const deleteNotifications = async (
  account: Account | string,
  activity: Activity,
  ctx: EventHandlerContext
): Promise<Notification | null> => {
  const accountInst =
    account instanceof Account ? account : await ensureAccount(account, ctx);
  if (!accountInst) return null;

  const notification = new Notification();

  notification.id = `${accountInst.id}-${activity.id}`;
  notification.account = accountInst;
  notification.activity = activity;

  return ctx.store.save<Notification>(notification);
};
