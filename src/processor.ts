import { SubstrateProcessor } from '@subsquid/substrate-processor';
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import * as envConfig from './env';
// import { lookupArchive } from '@subsquid/archive-registry';
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
  accountCreated,
  accountUpdated,
  accountFollowed,
  accountUnfollowed
} from './mappings';

// const database = new TypeormDatabase('subsocial-processor');
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

// processor.setBlockRange({ from: 677319 }); //1091772

processor.addEventHandler('Posts.PostCreated', postCreated);
processor.addEventHandler('Posts.PostUpdated', postUpdated);
processor.addEventHandler('Posts.PostShared', postShared);
processor.addEventHandler('Posts.PostMoved', postMoved);

processor.addEventHandler('Spaces.SpaceCreated', spaceCreated);
processor.addEventHandler('Spaces.SpaceUpdated', spaceUpdated);

processor.addEventHandler('Reactions.PostReactionCreated', postReactionCreated);
processor.addEventHandler('Reactions.PostReactionUpdated', postReactionUpdated);
processor.addEventHandler('Reactions.PostReactionDeleted', postReactionDeleted);

processor.addEventHandler('Profiles.ProfileCreated', accountCreated);
processor.addEventHandler('Profiles.ProfileUpdated', accountUpdated);

processor.addEventHandler('SpaceFollows.SpaceFollowed', spaceFollowed);
processor.addEventHandler('SpaceFollows.SpaceUnfollowed', spaceUnfollowed);

processor.addEventHandler('ProfileFollows.AccountFollowed', accountFollowed);
processor.addEventHandler(
  'ProfileFollows.AccountUnfollowed',
  accountUnfollowed
);

processor.run();
