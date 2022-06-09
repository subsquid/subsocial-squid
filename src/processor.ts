import { SubstrateProcessor } from '@subsquid/substrate-processor';
import * as envConfig from './env';
// import { lookupArchive } from '@subsquid/archive-registry';
import {
  postCreated,
  postUpdated,
  postShared,
  postReactionCreated,
  postReactionUpdated,
  postReactionDeleted,
  spaceCreated,
  spaceUpdated,
  spaceFollowed,
  spaceUnfollowed,
  accountCreated,
  accountUpdated
} from './mappings';

const processor = new SubstrateProcessor('subsocial-processor');

processor.setBatchSize(envConfig.batchSize);

if (!envConfig.chainNode) {
  throw new Error('no CHAIN_NODE in env');
}

processor.setDataSource({
  archive: envConfig.indexerEndpointUrl,
  chain: envConfig.chainNode
});

// processor.setBlockRange({ from: 0, to: 0 });

processor.addEventHandler('posts.PostCreated', postCreated);
processor.addEventHandler('posts.PostUpdated', postUpdated);
processor.addEventHandler('posts.PostShared', postShared);

processor.addEventHandler('spaces.SpaceCreated', spaceCreated);
processor.addEventHandler('spaces.SpaceUpdated', spaceUpdated);

processor.addEventHandler('reactions.PostReactionCreated', postReactionCreated);
processor.addEventHandler('reactions.PostReactionUpdated', postReactionUpdated);
processor.addEventHandler('reactions.PostReactionDeleted', postReactionDeleted);

processor.addEventHandler('spaceFollows.SpaceFollowed', spaceFollowed);
processor.addEventHandler('spaceFollows.SpaceUnfollowed', spaceUnfollowed);

processor.addEventHandler('profiles.ProfileCreated', accountCreated);
processor.addEventHandler('profiles.ProfileUpdated', accountUpdated);

processor.run();
