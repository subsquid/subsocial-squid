import dayjs from 'dayjs';
import * as ss58 from '@subsquid/ss58';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import { MetaItem } from "@subsocial/types"
// import { PostId } from "@subsocial/types/substrate/interfaces"
// import { Network, TreasuryProposal } from "../generated/graphql-server/src/modules/treasury-proposal/treasury-proposal.model"
import { Space, Post } from '../model';
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';

dayjs.extend(localizedFormat);

let subsocialSs58CodecInst: ss58.Codec | null = null;

export type RelationFieldType = 'posts' | 'spaces';
export type ObjectType = Space | Post | undefined;
export type TagInEntityTagType = GetOrCreateTagType & {
  entityWithRelations: ObjectType;
};
export type GetOrCreateTagType = {
  store: Store;
  tags: string[];
  entity: ObjectType;
  relationField: RelationFieldType;
};

export const validateEventHandlerInputs = (ctx: EventHandlerContext) => {
  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }
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

export const formatTegs = (tags: string[]) => {
  return tags.flatMap((value) => {
    value = value.trim();
    let splitter = ' ';
    if (value.includes(';')) splitter = ';';

    return value
      .split(splitter)
      .filter((el) => el != '')
      .map((value) => {
        if (value.startsWith('#')) {
          value = value.replace('#', '');
        }

        return value.trim().toLowerCase().replace(',', '').replace(/'/g, '`');
      });
  });
};

export const formatDate = (date: string) =>
  dayjs(Number(date)).format('YYYY-MM-DD hh:mm:ss');

export const stringDateToTimestamp = (date: string | undefined) =>
  date && date != '' && new Date(Number(date)).getTime();

export const getDateWithoutTime = (date: Date | undefined): Date | undefined =>
  date ? new Date(dayjs(date).format('YYYY-MM-DD')) : undefined;

export const printEventLog = (ctx: EventHandlerContext) => {
  const { method, blockNumber, indexInBlock } = ctx.event;
  console.log(
    `>>> method ::: ${method} ::: >>> blockNumber :::  ${blockNumber} ::: >>> indexInBlock [ ${indexInBlock} ]`
  );
};
