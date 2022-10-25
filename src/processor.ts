import { lookupArchive, KnownArchives } from '@subsquid/archive-registry';

import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor
} from '@subsquid/substrate-processor';
import { BatchBlock } from '@subsquid/substrate-processor/src/processor/batchProcessor';
import { Store, TypeormDatabase } from '@subsquid/processor-tools';
import * as envConfig from './env';
import {
  getParsedEventsData,
  initialProcessingEntityRelations
} from './common/eventsData';

import {
  postCreated,
  postUpdated,
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

const processor = new SubstrateBatchProcessor()
  .setBatchSize(envConfig.batchSize)
  .setDataSource({
    archive: lookupArchive('subsocial' as KnownArchives, {
      release: 'FireSquid'
    }),
    chain: envConfig.chainNode
  })
  .setTypesBundle('subsocial')
  .includeAllBlocks()
  .addEvent('Posts.PostCreated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Posts.PostUpdated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Posts.PostMoved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Spaces.SpaceCreated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Spaces.SpaceUpdated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Reactions.PostReactionCreated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Reactions.PostReactionUpdated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Reactions.PostReactionDeleted', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Profiles.ProfileUpdated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('SpaceFollows.SpaceFollowed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('SpaceFollows.SpaceUnfollowed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('AccountFollows.AccountFollowed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('AccountFollows.AccountUnfollowed', {
    data: { event: { args: true } }
  } as const);

if (!envConfig.chainNode) {
  throw new Error('no CHAIN_NODE in env');
}

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;
export type Block = BatchBlock<Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  const parsedEvents = getParsedEventsData(ctx);
  await ctx.store.load();

  await initialProcessingEntityRelations(parsedEvents, ctx);

  await ctx.store.load();
});

// processor.addEventHandler('Posts.PostCreated', postCreated);
// processor.addEventHandler('Posts.PostUpdated', postUpdated);
// processor.addEventHandler('Posts.PostMoved', postMoved);
//
// processor.addEventHandler('Spaces.SpaceCreated', spaceCreated);
// processor.addEventHandler('Spaces.SpaceUpdated', spaceUpdated);
//
// processor.addEventHandler('Reactions.PostReactionCreated', postReactionCreated);
// processor.addEventHandler('Reactions.PostReactionUpdated', postReactionUpdated);
// processor.addEventHandler('Reactions.PostReactionDeleted', postReactionDeleted);
//
// processor.addEventHandler('Profiles.ProfileUpdated', accountUpdated);
//
// processor.addEventHandler('SpaceFollows.SpaceFollowed', spaceFollowed);
// processor.addEventHandler('SpaceFollows.SpaceUnfollowed', spaceUnfollowed);
//
// processor.addEventHandler('AccountFollows.AccountFollowed', accountFollowed);
// processor.addEventHandler(
//   'AccountFollows.AccountUnfollowed',
//   accountUnfollowed
// );
//
// processor.run();
