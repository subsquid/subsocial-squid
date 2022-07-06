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

export enum SpaceCountersAction {
  PostAdded = 'PostAdded',
  PostUpdated = 'PostUpdated',
  PostDeleted = 'PostDeleted'
}
