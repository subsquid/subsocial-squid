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
import { Store, TypeormDatabase } from '@subsquid/processor-tools';
import * as envConfig from './env';
import {
  getParsedEventsData
  // processEntityRelationsByStorageData
} from './common/eventsData';
import { Post, Account, Space, Reaction } from './model';

// import {
//   postCreated,
//   postUpdated,
//   postMoved,
//   postReactionCreated,
//   postReactionUpdated,
//   postReactionDeleted,
//   spaceCreated,
//   spaceUpdated,
//   spaceFollowed,
//   spaceUnfollowed,
//   accountUpdated,
//   accountFollowed,
//   accountUnfollowed
// } from './mappings';
import { StorageDataManager } from './storage/storageDataManager';
import { EntityRelationsManager } from './common/entityRelationsManager';
import { handleSpaces } from './mappings/space';
import { handlePosts } from './mappings/post';
import { handleAccountFollowing } from './mappings/accountFollows';
import { handleProfiles } from './mappings/account';
import { handleSpacesFollowing } from './mappings/spaceFollows';
import { handlePostReactions } from "./mappings/reaction";

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
  const entityRelationsManager = EntityRelationsManager.getInstance(ctx);

  entityRelationsManager.setEntityRelationsForFetch(Post, [
    { entityClass: Account, propName: 'ownedByAccount' },
    {
      entityClass: Post,
      propName: 'rootPost',
      relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
    },
    {
      entityClass: Post,
      propName: 'parentPost',
      relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
    },
    {
      entityClass: Space,
      propName: 'space',
      relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
    }
  ]);

  entityRelationsManager.setEntityRelationsForFetch(Space, [
    { entityClass: Account, propName: 'ownedByAccount' }
  ]);
  entityRelationsManager.setEntityRelationsForFetch(Account, [
    { entityClass: Space, propName: 'profileSpace' }
  ]);
  entityRelationsManager.setEntityRelationsForFetch(Reaction, [
    { entityClass: Account, propName: 'account' },
    {
      entityClass: Post,
      propName: 'post',
      relations: [
        { entityClass: Account, propName: 'ownedByAccount' },
        {
          entityClass: Post,
          propName: 'parentPost',
          relations: [{ entityClass: Account, propName: 'ownedByAccount' }] // TODO check do we really need this nested relations
        },
        {
          entityClass: Post,
          propName: 'rootPost',
          relations: [{ entityClass: Account, propName: 'ownedByAccount' }]
        },
        { entityClass: Space, propName: 'space' }
      ]
    }
  ]);

  /**
   * Collect data from all tracked events (postId, accountId, spaceId, etc.) and
   * add IDs to load queue.
   */
  const parsedEvents = getParsedEventsData(ctx);

  let idsForLoadPrev = new Map(
    [...ctx.store.idsForDeferredLoad.entries()].map((i) => i)
  );
  /**
   * Load entities from DB to the cache by collected IDs from events
   */
  await ctx.store.load();

  /**
   * Load all necessary relations for all loaded entities in the previous load
   * by "idsForLoadPrev" and generated relations stack.
   */
  await entityRelationsManager.loadEntitiesByRelationsStackAll(idsForLoadPrev);

  /**
   * Load data from chain storage for required entities by collected IDs in
   * events. We need this for posts and spaces on "create" and "update" events
   * as we need get actual detailed data from the chain. In appropriate events
   * parameters we can get only IDs.
   */
  await StorageDataManager.getInstance(ctx).fetchStorageDataByEventsData(
    parsedEvents
  );

  // /**
  //  * Add to load queue IDs from storage data (e.g. "post.struct.parentId")
  //  */
  // await processEntityRelationsByStorageData(parsedEvents, ctx);
  //
  // idsForLoadPrev = new Map(
  //   [...ctx.store.idsForDeferredLoad.entries()].map((i) => i)
  // );
  // await ctx.store.load();
  //
  // /**
  //  * Load all necessary relations for all loaded entities in the previous load
  //  * by "idsForLoadPrev" and generated relations stack.
  //  */
  // await entityRelationsManager.loadEntitiesByRelationsStackAll(idsForLoadPrev);

  await handleSpaces(ctx, parsedEvents);
  await handleProfiles(ctx, parsedEvents);
  await handleAccountFollowing(ctx, parsedEvents);
  await handleSpacesFollowing(ctx, parsedEvents);
  await handlePosts(ctx, parsedEvents);
  await handlePostReactions(ctx, parsedEvents);
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
