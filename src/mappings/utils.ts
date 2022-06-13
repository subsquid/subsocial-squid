import dayjs from 'dayjs';
import * as ss58 from '@subsquid/ss58';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import { MetaItem } from "@subsocial/types"
// import { PostId } from "@subsocial/types/substrate/interfaces"
// import { Network, TreasuryProposal } from "../generated/graphql-server/src/modules/treasury-proposal/treasury-proposal.model"
import { Space, Post } from '../model';
import { Store } from '@subsquid/substrate-processor';
import { SpaceStruct, SpaceContent } from '@subsocial/types/dto';

dayjs.extend(localizedFormat);

let subsocialSs58CodecInst: ss58.Codec | null = null;

export type ObjectType = Space | Post | undefined;

export type RelationFieldType = 'posts' | 'spaces';

export type GetOrCreateTagType = {
  store: Store;
  tags: string[];
  entity: ObjectType;
  relationField: RelationFieldType;
};

export type TagInEntityTagType = GetOrCreateTagType & {
  entityWithRelations: ObjectType;
};

export interface SpaceDataExtended {
  space: Space;
  struct: SpaceStruct;
  content: SpaceContent | undefined;
}

export enum EventAction {
  PostCreated = 'PostCreated',
  PostDeleted = 'PostDeleted',
  PostUpdated = 'PostUpdated',
  PostShared = 'PostShared',
  PostMoved = 'PostMoved',
  PostReactionCreated = 'PostReactionCreated',
  PostReactionUpdated = 'PostReactionUpdated',
  PostReactionDeleted = 'PostReactionDeleted',
  SpaceCreated = 'SpaceCreated',
  SpaceUpdated = 'SpaceUpdated',
  SpaceFollowed = 'SpaceFollowed',
  SpaceUnfollowed = 'SpaceUnfollowed',
  AccountFollowed = 'AccountFollowed',
  AccountUnfollowed = 'AccountUnfollowed'
}

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
