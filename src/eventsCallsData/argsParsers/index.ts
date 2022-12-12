import {
  parsePostCreatedCallArgs,
  parsePostUpdatedCallArgs,
  parsePostMoveCallArgs,
  parseSpaceCreateCallArgs,
  parseSpaceUpdateCallArgs,
  parsePostReactionCreateCallArgs,
  parsePostReactionUpdateCallArgs,
  parsePostReactionDeleteCallArgs
} from './callArgsParsers';
import {
  parsePostCreatedEventArgs,
  parsePostUpdatedEventArgs,
  parsePostMovedEventArgs,
  parseSpaceCreatedEventArgs,
  parseSpaceUpdatedEventArgs,
  parsePostReactionCreatedEventArgs,
  parsePostReactionUpdatedEventArgs,
  parsePostReactionDeletedEventArgs,
  parseProfileUpdatedEventArgs,
  parseSpaceFollowedEventArgs,
  parseSpaceUnfollowedEventArgs,
  parseAccountFollowedEventArgs,
  parseAccountUnfollowedEventArgs
} from './eventArgsParsers';

export default {
  call: {
    parsePostCreatedCallArgs,
    parsePostUpdatedCallArgs,
    parsePostMoveCallArgs,
    parseSpaceCreateCallArgs,
    parseSpaceUpdateCallArgs,
    parsePostReactionCreateCallArgs,
    parsePostReactionUpdateCallArgs,
    parsePostReactionDeleteCallArgs
  },
  event: {
    parsePostCreatedEventArgs,
    parsePostUpdatedEventArgs,
    parsePostMovedEventArgs,
    parseSpaceCreatedEventArgs,
    parseSpaceUpdatedEventArgs,
    parsePostReactionCreatedEventArgs,
    parsePostReactionUpdatedEventArgs,
    parsePostReactionDeletedEventArgs,
    parseProfileUpdatedEventArgs,
    parseSpaceFollowedEventArgs,
    parseSpaceUnfollowedEventArgs,
    parseAccountFollowedEventArgs,
    parseAccountUnfollowedEventArgs
  }
};
