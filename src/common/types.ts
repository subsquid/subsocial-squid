import { Block } from '../processor';

import {
  Space,
  Account,
  Post,
  AccountFollowers,
  Activity,
  NewsFeed,
  Notification,
  PostFollowers,
  CommentFollowers,
  SpaceFollowers,
  Reaction,
  ReactionKind,
  EventName,
  PostKind
} from '../model';
import { PostWithAllDetails, PostData, PostStruct } from '@subsocial/types/dto';
import { Store } from '@subsquid/processor-tools';
import { EventHandlerContext } from '@subsquid/substrate-processor';
import {
  SpacePermissionMap,
  SummarizedContent
} from '@subsocial/api/types/dto';
import { CommonContent } from '@subsocial/api/types';
import {
  IpfsCommonContent,
  IpfsPostContent,
  IpfsSpaceContent
} from '@subsocial/api/types/ipfs';

export type DbEntity =
  | typeof Account
  | typeof Space
  | typeof Post
  | typeof AccountFollowers
  | typeof Activity
  | typeof NewsFeed
  | typeof Notification
  | typeof PostFollowers
  | typeof CommentFollowers
  | typeof Reaction
  | typeof SpaceFollowers;

export enum SpaceCountersAction {
  PostAdded = 'PostAdded',
  PostUpdated = 'PostUpdated',
  PostDeleted = 'PostDeleted'
}

// export enum SpacePermissionRoot {
//   nonePermissions = 'nonePermissions',
//   everyonePermissions = 'everyonePermissions',
//   followerPermissions = 'followerPermissions',
//   spaceOwnerPermissions = 'spaceOwnerPermissions'
// }

// export enum SpacePermissionRoot {
//   none = 'none',
//   everyone = 'everyone',
//   follower = 'follower',
//   spaceOwner = 'spaceOwner'
// }

export interface EventData {
  id: string; // Event ID
  blockNumber: number;
  blockHash: string;
  timestamp: Date;
  indexInBlock: number;
  name: string;
}

export type ContentSrcDecorated = {
  ipfsSrc: string | null;
  otherSrc: string | null;
  none: boolean;
};
export type ContentDataIpfs = CommonContent;

export type IpfsSpaceContentSummarized = IpfsSpaceContent & SummarizedContent;
export type IpfsPostContentSummarized = IpfsPostContent & SummarizedContent;

export type SpaceStorageData = {
  handle: string | null;
  ipfsContent: IpfsSpaceContentSummarized | null;
};
export type PostStorageData = {
  ipfsContent: IpfsPostContentSummarized | null;
};

/**
 * :::::: CREATE POST ::::::
 */
export interface CreatePostCallParsedData extends ContentSrcDecorated {
  forced: boolean;
  forcedData: {
    account: string;
    block: number;
    time: Date;
    owner: string;
    hidden: boolean;
  } | null;
  postKind: PostKind;
  originalPost: string | null;
  parentPostId: string | null;
  rootPostId: string | null;
  spaceId: string | null | undefined;
}
export interface CreatePostEventParsedData {
  accountId: string;
  postId: string;
}

export type PostCreatedData = EventData &
  CreatePostCallParsedData &
  CreatePostEventParsedData;

/**
 * :::::: UPDATE POST ::::::
 */

export interface UpdatePostCallParsedData extends ContentSrcDecorated {
  spaceId: string | null | undefined;
  hidden: boolean | null | undefined;
}

export interface UpdatePostEventParsedData {
  accountId: string;
  postId: string;
}

export type PostUpdatedData = EventData &
  UpdatePostCallParsedData &
  UpdatePostEventParsedData;

/**
 * :::::: MOVE POST ::::::
 */

export interface MovePostCallParsedData {
  postId: string;
  toSpace: string | null | undefined;
}

export interface MovedPostEventParsedData {
  accountId: string;
  postId: string;
  fromSpace: string | null | undefined;
  toSpace: string | null | undefined;
}

export type PostMovedData = EventData &
  MovePostCallParsedData &
  MovedPostEventParsedData;

/**
 * :::::: CREATE SPACE ::::::
 */
export interface SpacePermissionsScope {
  none: Required<SpacePermissionMap>;
  everyone: Required<SpacePermissionMap>;
  follower: Required<SpacePermissionMap>;
  spaceOwner: Required<SpacePermissionMap>;
}

export interface CreateSpaceCallParsedData extends ContentSrcDecorated {
  permissions: SpacePermissionsScope;
  forced: boolean;
  forcedData: {
    account: string;
    block: number;
    time: Date;
    owner: string;
    hidden: boolean;
  } | null;
}
export interface CreatedSpaceEventParsedData {
  accountId: string;
  spaceId: string;
}

export type SpaceCreatedData = EventData &
  CreateSpaceCallParsedData &
  CreatedSpaceEventParsedData;

/**
 * :::::: UPDATE SPACE ::::::
 */

export interface UpdateSpaceCallParsedData extends ContentSrcDecorated {
  permissions: SpacePermissionsScope;
  hidden: boolean;
}
export interface UpdatedSpaceEventParsedData {
  accountId: string;
  spaceId: string;
}

export type SpaceUpdatedData = EventData &
  UpdateSpaceCallParsedData &
  UpdatedSpaceEventParsedData;

/**
 * :::::: POST REACTION CREAT ::::::
 */

export interface PostReactionCreateCallParsedData {
  postId: string;
  reactionKind: ReactionKind;
  forced: boolean;
  forcedData: {
    account: string;
    block: number;
    time: Date;
  } | null;
}

export interface PostReactionCreatedEventParsedData {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
}

export type PostReactionCreatedData = EventData &
  PostReactionCreateCallParsedData &
  PostReactionCreatedEventParsedData;

/**
 * :::::: POST REACTION UPDATE ::::::
 */

export interface PostReactionUpdateCallParsedData {
  postId: string;
  reactionId: string;
  newReactionKind: ReactionKind;
}

export interface PostReactionUpdatedEventParsedData {
  accountId: string;
  postId: string;
  reactionId: string;
  newReactionKind: ReactionKind;
}

export type PostReactionUpdatedData = EventData &
  PostReactionUpdateCallParsedData &
  PostReactionUpdatedEventParsedData;

/**
 * :::::: POST REACTION DELETE ::::::
 */

export interface PostReactionDeleteCallParsedData {
  postId: string;
  reactionId: string;
  forced: boolean;
  forcedData: {
    account: string;
  } | null;
}

export interface PostReactionDeletedEventParsedData {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
}

export type PostReactionDeletedData = EventData &
  PostReactionDeleteCallParsedData &
  PostReactionDeletedEventParsedData;

/**
 * :::::: PROFILE UPDATE ::::::
 */

export interface ProfileUpdatedEventParsedData {
  accountId: string;
  spaceId: string | null | undefined;
}

export type ProfileUpdatedData = EventData & ProfileUpdatedEventParsedData;

/**
 * :::::: SPACE FOLLOWED ::::::
 */

export interface SpaceFollowedEventParsedData {
  followerId: string;
  spaceId: string;
}

export type SpaceFollowedData = EventData & SpaceFollowedEventParsedData;

/**
 * :::::: SPACE UNFOLLOWED ::::::
 */

export type SpaceUnfollowedEventParsedData = SpaceFollowedEventParsedData;

export type SpaceUnfollowedData = SpaceFollowedData;

/**
 * :::::: ACCOUNT FOLLOWED ::::::
 */

export interface AccountFollowedEventParsedData {
  followerId: string;
  accountId: string;
}

export type AccountFollowedData = EventData & AccountFollowedEventParsedData;

/**
 * :::::: ACCOUNT UNFOLLOWED ::::::
 */

export type AccountUnfollowedEventParsedData = AccountFollowedEventParsedData;

export type AccountUnfollowedData = AccountFollowedData;

export type EventId = string;

export type ParsedEventsData =
  | PostCreatedData
  | PostUpdatedData
  | PostMovedData
  | SpaceCreatedData
  | SpaceUpdatedData
  | PostReactionCreatedData
  | PostReactionUpdatedData
  | PostReactionDeletedData
  | ProfileUpdatedData
  | SpaceFollowedData
  | SpaceUnfollowedData
  | AccountFollowedData
  | AccountUnfollowedData;

export type ParsedEventsDataMap = Map<
  EventName,
  Map<EventId, ParsedEventsData>
>;

export type PostWithDetails = Omit<PostWithAllDetails, 'post'> & {
  post: Omit<PostData, 'struct'> & {
    struct: PostStruct & {
      rootPostId: string;
      parentId: string;
    };
  };
};

export type EventContext = EventHandlerContext<
  Store,
  { event: { args: true; call: true; indexInBlock: true } }
>;
