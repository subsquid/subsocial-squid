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
import { Store } from '@subsquid/typeorm-store';
import { EventHandlerContext } from '@subsquid/substrate-processor';

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

export type CommonEventHandlerContext = EventHandlerContext<
  Store,
  { event: { args: true } }
>;

// export enum EventName {
//   'Posts.PostCreated' = 'Posts.PostCreated',
//   'Posts.PostDeleted' = 'Posts.PostDeleted',
//   'Posts.PostUpdated' = 'Posts.PostUpdated',
//   'Posts.PostShared' = 'Posts.PostShared',
//   'Posts.PostMoved' = 'Posts.PostMoved',
//   'Reactions.PostReactionCreated' = 'Reactions.PostReactionCreated',
//   'Reactions.PostReactionUpdated' = 'Reactions.PostReactionUpdated',
//   'Reactions.PostReactionDeleted' = 'Reactions.PostReactionDeleted',
//   'Spaces.SpaceCreated' = 'Spaces.SpaceCreated',
//   'Spaces.SpaceUpdated' = 'Spaces.SpaceUpdated',
//   'Spaces.SpaceFollowed' = 'Spaces.SpaceFollowed',
//   'Spaces.SpaceUnfollowed' = 'Spaces.SpaceUnfollowed',
//   'ProfileFollows.AccountFollowed' = 'ProfileFollows.AccountFollowed',
//   'ProfileFollows.AccountUnfollowed' = 'ProfileFollows.AccountUnfollowed',
//   'Profiles.ProfileCreated' = 'Profiles.ProfileCreated',
//   'Profiles.ProfileUpdated' = 'Profiles.ProfileUpdated'
// }

export enum EventName {
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
