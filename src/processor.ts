import { SubstrateProcessor } from '@subsquid/substrate-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';
import * as envConfig from './env';
import {
  postCreated,
  postUpdated,
  postShared,
  postMoved,
  postReactionCreated,
  postReactionUpdated,
  postReactionDeleted,
  spaceCreated,
  spaceUpdated,
  spaceFollowed,
  spaceUnfollowed,
  accountUpdated,
  accountFollowed,
  accountUnfollowed
} from './mappings';

const database = new TypeormDatabase();
const processor = new SubstrateProcessor(database);

processor.setTypesBundle('subsocial');
processor.setBatchSize(envConfig.batchSize);

if (!envConfig.chainNode) {
  throw new Error('no CHAIN_NODE in env');
}

processor.setDataSource({
  archive: envConfig.indexerEndpointUrl,
  chain: envConfig.chainNode
});

processor.addEventHandler('Posts.PostCreated', postCreated);
processor.addEventHandler('Posts.PostUpdated', postUpdated);
// processor.addEventHandler('Posts.PostShared', postShared); // TODO must be reimplemented
processor.addEventHandler('Posts.PostMoved', postMoved);

processor.addEventHandler('Spaces.SpaceCreated', spaceCreated);
processor.addEventHandler('Spaces.SpaceUpdated', spaceUpdated);

processor.addEventHandler('Reactions.PostReactionCreated', postReactionCreated);
processor.addEventHandler('Reactions.PostReactionUpdated', postReactionUpdated);
processor.addEventHandler('Reactions.PostReactionDeleted', postReactionDeleted);

processor.addEventHandler('Profiles.ProfileUpdated', accountUpdated);

processor.addEventHandler('SpaceFollows.SpaceFollowed', spaceFollowed);
processor.addEventHandler('SpaceFollows.SpaceUnfollowed', spaceUnfollowed);

processor.addEventHandler('AccountFollows.AccountFollowed', accountFollowed);
processor.addEventHandler(
  'AccountFollows.AccountUnfollowed',
  accountUnfollowed
);

processor.run();
