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
  Reaction
} from '../model';
import { SpaceContent, SpaceStruct } from '@subsocial/types/dto';

export interface SpaceDataExtended {
  space: Space;
  struct: SpaceStruct;
  content: SpaceContent | undefined;
}

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
  AccountUnfollowed = 'AccountUnfollowed',
  ProfileCreated = 'ProfileCreated',
  ProfileUpdated = 'ProfileUpdated'
}

export enum ReactionKind {
  Upvote = 'Upvote',
  Downvote = 'Downvote'
}

export enum Status {
  Active = 'Active',
  Deleted = 'Deleted'
}
