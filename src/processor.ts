import { lookupArchive, KnownArchives } from '@subsquid/archive-registry';

import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  SubstrateBlock
} from '@subsquid/substrate-processor';
import {
  BatchBlock,
  BatchProcessorEventItem
} from '@subsquid/substrate-processor/src/processor/batchProcessor';
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import * as envConfig from './env';
import {
  getParsedEventsData
  // processEntityRelationsByStorageData
} from './common/eventsData';
import { StorageDataManager } from './storage/storageDataManager';
// import { EntityRelationsManager } from './common/entityRelationsManager';
import { handleSpaces } from './mappings/space';
import { handlePosts } from './mappings/post';
import { handleAccountFollowing } from './mappings/accountFollows';
import { handleProfiles } from './mappings/account';
import { handleSpacesFollowing } from './mappings/spaceFollows';
import { handlePostReactions } from './mappings/reaction';
import { splitIntoBatches } from './common/utils';

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive('subsocial-parachain' as KnownArchives, {
      release: 'FireSquid'
    }),
    chain: envConfig.chainNode
  })
  // .setBlockRange({ from: 1093431 }) // PostCreated
  // .setBlockRange({ from: 1093209 }) // SpaceCreated
  .setTypesBundle('subsocial')
  .addEvent('Posts.PostCreated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Posts.PostUpdated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Posts.PostMoved', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Spaces.SpaceCreated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Spaces.SpaceUpdated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Reactions.PostReactionCreated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Reactions.PostReactionUpdated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Reactions.PostReactionDeleted', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('Profiles.ProfileUpdated', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('SpaceFollows.SpaceFollowed', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('SpaceFollows.SpaceUnfollowed', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('AccountFollows.AccountFollowed', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const)
  .addEvent('AccountFollows.AccountUnfollowed', {
    data: { event: { args: true, call: true, indexInBlock: true } }
  } as const);

if (!envConfig.chainNode) {
  throw new Error('no CHAIN_NODE in env');
}

export type Item = BatchProcessorItem<typeof processor>;
export type EventItem = BatchProcessorEventItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;
export type Block = BatchBlock<Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  ctx.log
    .child('sqd:processor')
    .info(
      `Batch size - ${ctx.blocks.length} [${
        ctx.blocks.length > 0
          ? `${ctx.blocks[0].header.height}/${
              ctx.blocks[ctx.blocks.length - 1].header.height
            }`
          : '---'
      }]`
    );

  const currentBlocksListFull = [...ctx.blocks];
  let blocksBatchHandlerIndex = 1;
  for (const blocksBatch of splitIntoBatches(
    currentBlocksListFull,
    ctx.blocks[ctx.blocks.length - 1].header.height > 11000000
      ? ctx.blocks.length + 1
      : 3
  )) {
    const partialCtx = ctx;
    partialCtx.blocks = blocksBatch;
    await blocksBatchHandler(partialCtx);
    ctx.log.info(
      `Blocks batch #${blocksBatchHandlerIndex} has been processed.`
    );
    blocksBatchHandlerIndex++;
  }
});

async function blocksBatchHandler(ctx: Ctx) {

  // entityRelationsManager.setEntityRelationsForFetch(Post, [
  //   { entityClass: Account, propName: 'ownedByAccount' },
  //   {
  //     entityClass: Post,
  //     propName: 'rootPost',
  //     relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
  //   },
  //   {
  //     entityClass: Post,
  //     propName: 'parentPost',
  //     relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
  //   },
  //   {
  //     entityClass: Space,
  //     propName: 'space',
  //     relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
  //   }
  // ]);
  //
  // entityRelationsManager.setEntityRelationsForFetch(Space, [
  //   { entityClass: Account, propName: 'ownedByAccount' }
  // ]);
  // entityRelationsManager.setEntityRelationsForFetch(Account, [
  //   { entityClass: Space, propName: 'profileSpace' }
  // ]);
  // entityRelationsManager.setEntityRelationsForFetch(Reaction, [
  //   { entityClass: Account, propName: 'account' },
  //   {
  //     entityClass: Post,
  //     propName: 'post',
  //     relations: [
  //       { entityClass: Account, propName: 'ownedByAccount' },
  //       {
  //         entityClass: Post,
  //         propName: 'parentPost',
  //         relations: [{ entityClass: Account, propName: 'ownedByAccount' }] // TODO check do we really need this nested relations
  //       },
  //       {
  //         entityClass: Post,
  //         propName: 'rootPost',
  //         relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
  //       },
  //       { entityClass: Space, propName: 'space' }
  //     ]
  //   }
  // ]);

  /**
   * Collect data from all tracked events (postId, accountId, spaceId, etc.) and
   * add IDs to load queue.
   */
  const parsedEvents = getParsedEventsData(ctx);

  /**
   * Load data from chain storage for required entities by collected IDs in
   * events. We need this for posts and spaces on "create" and "update" events
   * as we need get actual detailed data from the chain. In appropriate events
   * parameters we can get only IDs.
   */
  await StorageDataManager.getInstance(ctx).fetchStorageDataByEventsData(
    parsedEvents
  );

  ctx.log.info('DONE :: fetchStorageDataByEventsData');

  await handleSpaces(ctx, parsedEvents);
  ctx.log.info('DONE :: handleSpaces');

  await handleProfiles(ctx, parsedEvents);
  ctx.log.info('DONE :: handleProfiles');

  await handleAccountFollowing(ctx, parsedEvents);
  ctx.log.info('DONE :: handleAccountFollowing');

  await handleSpacesFollowing(ctx, parsedEvents);
  ctx.log.info('DONE :: handleSpacesFollowing');

  await handlePosts(ctx, parsedEvents);
  ctx.log.info('DONE :: handlePosts');

  await handlePostReactions(ctx, parsedEvents);
  ctx.log.info('DONE :: handlePostReactions');

  await StorageDataManager.getInstance(ctx).purgeStorage();
}
