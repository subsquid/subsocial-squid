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
  EventName
} from '../model';
import { PostWithAllDetails, PostData, PostStruct } from '@subsocial/types/dto';

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

export enum SpacePermissionRoot {
  nonePermissions = 'nonePermissions',
  everyonePermissions = 'everyonePermissions',
  followerPermissions = 'followerPermissions',
  spaceOwnerPermissions = 'spaceOwnerPermissions'
}

interface EventData {
  id: string; // Event ID
  blockNumber: number;
  timestamp: Date;
  block: Block;
}

export interface PostCreatedUpdatedData extends EventData {
  accountId: string;
  postId: string;
}

export interface PostMovedData extends EventData {
  accountId: string;
  postId: string;
  spaceId: string | null;
}

export interface SpaceCreatedUpdatedData extends EventData {
  accountId: string;
  spaceId: string;
}

export interface PostReactionData extends EventData {
  accountId: string;
  postId: string;
  reactionId: string;
  reactionKind: ReactionKind;
}

export interface AccountUpdatedData extends EventData {
  accountId: string;
  spaceId: string | null;
}

export interface AccountFollowedUnfollowedData extends EventData {
  followerId: string;
  followingId: string;
}

export interface SpaceFollowedUnfollowedData extends EventData {
  followerId: string;
  spaceId: string;
}

export type ParsedEventsData =
  | PostCreatedUpdatedData
  | PostMovedData
  | SpaceCreatedUpdatedData
  | PostReactionData
  | AccountUpdatedData
  | AccountFollowedUnfollowedData
  | SpaceFollowedUnfollowedData;

export type ParsedEventsDataMap = Map<EventName, Set<ParsedEventsData>>;

export type PostWithDetails = Omit<PostWithAllDetails, 'post'> & {
  post: Omit<PostData, 'struct'> & {
    struct: PostStruct & {
      rootPostId: string;
      parentId: string;
    };
  };
};
