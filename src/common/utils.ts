import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import * as ss58 from '@subsquid/ss58';
import md5 from 'md5';
import { EventHandlerContext } from './contexts';
import { EventName, PostKind, Post } from '../model';
import { EventData } from './types';
import { summarizeMd } from '@subsocial/utils';

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
export const decorateEventName = (rawEventName: string): string => {
  return rawEventName.split('.')[1];
};

export const getActivityEntityId = (
  blockNumber: string,
  indexInBlock: string,
  eventName: string | EventName
): string => {
  return `${blockNumber}-${indexInBlock}-${md5(eventName)}`;
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

export const addressStringToSs58 = (address: string): Uint8Array => {
  const codecInst = getSubsocialSs58Codec();
  return codecInst.decode(address);
};

export const ensurePositiveOrZeroValue = (inputValue: number): number => {
  return inputValue < 0 ? 0 : inputValue;
};

export const stringDateToTimestamp = (date: string | undefined) =>
  date && date !== '' && new Date(Number(date)).getTime();

export const getDateWithoutTime = (date: Date | undefined): Date | undefined =>
  date ? new Date(dayjs(date).format('YYYY-MM-DD')) : undefined;

export const getSyntheticEventName = (
  originEvent: EventName,
  post: Post
): EventName => {
  switch (originEvent) {
    case EventName.PostCreated:
      if (!post.rootPost) return EventName.PostCreated;
      if (post.rootPost) return EventName.CommentCreated;
      if (post.parentPost) return EventName.CommentReplyCreated;
      break;

    case EventName.PostShared:
      if (!post.rootPost) return EventName.PostShared;
      if (post.rootPost && !post.parentPost) return EventName.CommentShared;
      if (post.rootPost && post.parentPost) return EventName.CommentReplyShared;
      break;

    case EventName.PostMoved:
      /**
       * Only RegularPost can be moved to another not "null" space
       */
      if (post.space) return EventName.PostMoved;

      if (!post.rootPost) return EventName.PostDeleted;
      if (post.rootPost && !post.parentPost) return EventName.CommentDeleted;
      if (post.rootPost && post.parentPost)
        return EventName.CommentReplyDeleted;
      break;

    case EventName.PostUpdated:
      if (!post.rootPost) return EventName.PostUpdated;
      if (post.rootPost && !post.parentPost) return EventName.CommentUpdated;
      if (post.rootPost && post.parentPost)
        return EventName.CommentReplyUpdated;
      break;

    case EventName.PostReactionCreated:
      if (!post.rootPost) return EventName.PostReactionCreated;
      if (post.rootPost && !post.parentPost)
        return EventName.CommentReactionCreated;
      if (post.rootPost && post.parentPost)
        return EventName.CommentReplyReactionCreated;
      break;

    case EventName.PostReactionUpdated:
      if (!post.rootPost) return EventName.PostReactionUpdated;
      if (post.rootPost && !post.parentPost)
        return EventName.CommentReactionUpdated;
      if (post.rootPost && post.parentPost)
        return EventName.CommentReplyReactionUpdated;
      break;

    case EventName.PostReactionDeleted:
      if (!post.rootPost) return EventName.PostReactionDeleted;
      if (post.rootPost && !post.parentPost)
        return EventName.CommentReactionDeleted;
      if (post.rootPost && post.parentPost)
        return EventName.CommentReplyReactionDeleted;
      break;

    default:
      return originEvent;
  }
  return originEvent;
};

export async function batchCaller<T>({
  srcList,
  handler,
  batchSize = 100,
  timeout = 0
}: {
  srcList: Array<T>;
  handler: (batch: Array<T>, batchIndex?: number) => Promise<void>;
  batchSize?: number;
  timeout?: number;
}) {
  const promises = [];
  let delayIndex = 1;

  while (srcList.length > 0) {
    const batch = srcList.splice(0, batchSize);
    promises.push(
      new Promise<void>(async (res) => {
        await new Promise<void>((waitRes) =>
          setTimeout(async () => {
            const batchIndex = delayIndex;
            await handler(batch, batchIndex);
            waitRes();
          }, delayIndex * timeout)
        );
        res();
      })
    );
    delayIndex++;
  }
  await Promise.all(promises);
}

export function getOrderedListByBlockNumber<T extends EventData>(
  eventsList: Array<T>
): Array<T> {
  return eventsList.sort((a, b) =>
    a.blockNumber < b.blockNumber ? -1 : b.blockNumber < a.blockNumber ? 1 : 0
  );
}

export function* splitIntoBatches<T>(
  list: T[],
  maxBatchSize: number
): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list;
  } else {
    let offset = 0;
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize);
      offset += maxBatchSize;
    }
    yield list.slice(offset);
  }
}

export function getBodySummary(body: string | undefined | null): {
  summary: string | null;
  isShowMore: boolean;
} {
  const sum = {
    summary: null,
    isShowMore: false
  };
  if (!body) return sum;

  return summarizeMd(body);
}
