import { Entity, EntityClass, Store } from '@subsquid/processor-tools';
import { Ctx } from '../processor';
import { EntityClassConstructable } from '@subsquid/processor-tools/lib/store-with-cache/store';

type EntityRelationsStackItem = Map<
  EntityClass<Entity>,
  Record<string, EntityClass<Entity>>
>;
export type RelationItemConfig = {
  entityClass: EntityClass<Entity>;
  propName: string;
  relations?: RelationItemConfig[] | undefined;
};
type RelationsForFetch = Map<EntityClass<Entity>, Array<RelationItemConfig>>;

type RelationsStack = Array<EntityRelationsStackItem>;

export class EntityRelationsManager {
  private static instance: EntityRelationsManager;

  public relationsStack: RelationsStack = [];

  private relationsForFetch: RelationsForFetch = new Map();

  private constructor(private context: Ctx) {}

  static getInstance(ctx: Ctx): EntityRelationsManager {
    if (!EntityRelationsManager.instance) {
      EntityRelationsManager.instance = new EntityRelationsManager(ctx);
    }
    return EntityRelationsManager.instance;
  }

  setEntityRelationsForFetch<E extends Entity>(
    entityClass: EntityClass<E>,
    config: RelationItemConfig[]
  ) {
    this.relationsForFetch.set(entityClass, config);
    this.calculateRelationsStack();
  }

  calculateRelationsStack(): RelationsStack {
    const stack = new Map<number, EntityRelationsStackItem>();
    let index = 0;

    const processRelations = (
      rootClass: EntityClass<Entity>,
      relationsList: RelationItemConfig[],
      currentIndex: number
    ) => {
      const rels: Record<string, EntityClass<Entity>> = {};

      for (const relItem of relationsList) {
        rels[relItem.propName] = relItem.entityClass;
        if (relItem.relations)
          processRelations(
            relItem.entityClass,
            relItem.relations,
            currentIndex + 1
          );
      }
      if (!stack.has(currentIndex))
        stack.set(currentIndex, new Map([[rootClass, {}]]));

      stack.get(currentIndex)!.set(rootClass, {
        ...stack.get(currentIndex)!.get(rootClass),
        ...rels
      });
    };

    this.relationsForFetch.forEach((rootRelations, entityClass) => {
      const rels: Record<string, EntityClass<Entity>> = {};
      for (const relItem of rootRelations) {
        rels[relItem.propName] = relItem.entityClass;
        if (relItem.relations)
          processRelations(relItem.entityClass, relItem.relations, index + 1);
      }

      if (!stack.has(index)) stack.set(index, new Map([[entityClass, {}]]));

      stack.get(index)!.set(entityClass, {
        ...stack.get(index)!.get(entityClass),
        ...rels
      });
    });

    return [...stack.entries()]
      .sort((a, b) => (a[0] > b[0] ? -1 : b[0] > a[0] ? 1 : 0))
      .map((item) => item[1])
      .reverse();
  }

  async loadEntitiesByRelationsStackAll(
    srcIdsScope: Map<EntityClassConstructable, Set<string>>,
    index = 0
  ) {
    console.log(
      `this.relationsStack.length - ${this.relationsStack.length} / index - ${index}`
    );
    if (index === this.relationsStack.length) return;

    for (const [parentClass, relations] of [
      ...this.relationsStack[index].entries()
    ]) {
      for (const flushedId of srcIdsScope.get(parentClass) || []) {
        const flushedEntity = await this.context.store.get(
          parentClass,
          flushedId,
          false
        );
        if (!flushedEntity) continue;

        for (const propName in relations) {
          if (
            flushedEntity[propName as keyof Entity] &&
            typeof flushedEntity[propName as keyof Entity] === 'object' &&
            // @ts-ignore
            flushedEntity[propName as keyof Entity].id
          )
            this.context.store.deferredLoad(
              relations[propName],
              // @ts-ignore
              flushedEntity[propName as keyof Entity].id
            );
        }
      }
    }
    const idsForLoadPrev = new Map(
      [...this.context.store.idsForDeferredLoad.entries()].map((i) => i)
    );

    await this.context.store.load(500);

    await this.loadEntitiesByRelationsStackAll(idsForLoadPrev, index + 1);
  }

  purgeStorage() {
    this.relationsStack = [];
    this.relationsForFetch.clear();
  }
}

/**
 * Possible Stack result
 *
 * [
 *   Map(2) {
 *   [class Post] => {
 *     ownedByAccount: [class Account],
 *     rootPost: [class Post],
 *     parentPost: [class Post],
 *     space: [class Space]
 *    },
 *    [class Space] => { ownedByAccount: [class Account] }
 *  },
 *  Map(2) {
 *   [class Post] => {
 *       ownedByAccount: [class Account],
 *       createdByAccount: [class Account]
 *   },
 *   [class Space] => { ownedByAccount: [class Account] }
 *  },
 * Map(1) { [class Account] => { profileSpace: [class Space] } }
 * ]
 */
