import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import * as ss58 from '@subsquid/ss58';
import { EventHandlerContext } from './contexts';
import { eventLogsTrace } from '../env';

let subsocialSs58CodecInst: ss58.Codec | null = null;

export const validateEventHandlerInputs = (ctx: EventHandlerContext) => {
  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
};

/**
 * Remove pallet name from event name. It's required for using in conditions
 * together with enum values "EventName" as enum value cannot be defined in
 * format "PalletName.EventName".
 * @param rawEventName
 */
export const decorateEventName = (rawEventName: string) => {
  return rawEventName.split('.')[1];
};

export const getActivityEntityId = (
  blockNumber: string,
  indexInBlock: string
): string => {
  return `${blockNumber}-${indexInBlock}`;
};

export const getNotificationEntityId = (
  accountId: string,
  activityId: string
): string => {
  return `${accountId}-${activityId}`;
};

export const getAccountFollowersEntityId = (
  followerId: string,
  followingId: string
): string => {
  return `${followerId}-${followingId}`;
};

export const getNewsFeedEntityId = (
  accountId: string,
  activityId: string
): string => {
  return `${accountId}-${activityId}`;
};

export const getSpaceFollowersEntityId = (
  followerId: string,
  spaceId: string
): string => {
  return `${followerId}-${spaceId}`;
};

export const getPostFollowersEntityId = (
  followerId: string,
  postId: string
): string => {
  return `${followerId}-${postId}`;
};

export const getSubsocialSs58Codec = (): ss58.Codec => {
  if (!subsocialSs58CodecInst) subsocialSs58CodecInst = ss58.codec('subsocial');
  return subsocialSs58CodecInst;
};

export const addressSs58ToString = (address: Uint8Array) => {
  const codecInst = getSubsocialSs58Codec();
  return codecInst.encode(address);
};

export const ensurePositiveOrZeroValue = (inputValue: number): number => {
  return inputValue < 0 ? 0 : inputValue;
};

export const stringDateToTimestamp = (date: string | undefined) =>
  date && date !== '' && new Date(Number(date)).getTime();

export const getDateWithoutTime = (date: Date | undefined): Date | undefined =>
  date ? new Date(dayjs(date).format('YYYY-MM-DD')) : undefined;

export const printEventLog = (ctx: EventHandlerContext) => {
  const { name, indexInBlock } = ctx.event;
  const { height } = ctx.block;
  if (eventLogsTrace === 'true')
    console.log(
      `>>> method ::: ${name} ::: >>> blockNumber :::  ${height} ::: >>> indexInBlock [ ${indexInBlock} ]`
    );
};
