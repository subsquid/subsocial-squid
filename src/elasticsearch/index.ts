import { SubsocialElasticApi } from '@subsocial/elasticsearch';
import {
  ElasticPostDoc,
  ElasticSpaceDoc
} from '@subsocial/elasticsearch/types';
import { Ctx } from '../processor';
import { Post, Space } from '../model';
import { Entity } from '@subsquid/typeorm-store/lib/store';
import { splitIntoBatches } from '../common/utils';
import envConfig from '../config';

type ContentData<E> = E extends Post
  ? ElasticPostDoc
  : E extends Space
  ? ElasticSpaceDoc
  : never;

type EntityTypeName = 'post' | 'space';

export class ElasticSearchIndexerManager {
  private static instance: ElasticSearchIndexerManager;

  private esClient: SubsocialElasticApi;

  private indexingQueue: Map<
    EntityTypeName,
    Map<string, ElasticPostDoc | ElasticSpaceDoc>
  > = new Map([
    ['post', new Map()],
    ['space', new Map()]
  ]);

  static getInstance(ctx: Ctx): ElasticSearchIndexerManager {
    if (!ElasticSearchIndexerManager.instance) {
      ElasticSearchIndexerManager.instance = new ElasticSearchIndexerManager(
        ctx
      );
    }
    return ElasticSearchIndexerManager.instance;
  }

  constructor(private processorContext: Ctx) {
    this.esClient = new SubsocialElasticApi({
      url: envConfig.elasticSearchEndpoint,
      auth: {
        username: envConfig.elasticSearchUsername,
        password: envConfig.elasticSearchPassword
      },
      ssl: false
    });
  }

  async indexPost(post: Post): Promise<void> {
    await this.esClient.indexPostContent({
      id: post.id,
      content: this.getContent(post)
    });
  }

  async indexSpace(space: Space): Promise<void> {
    await this.esClient.indexSpaceContent({
      id: space.id,
      content: this.getContent(space)
    });
  }

  /**
   * Add entity content to the cache for adding to ES in the next batch.
   * @param entity: Post | Space
   */
  addToQueue<T extends Entity>(entity: T) {
    let entityTypeName: EntityTypeName = 'post';
    if (entity instanceof Post) {
      entityTypeName = 'post';
    } else if (entity instanceof Space) {
      entityTypeName = 'space';
    } else {
      throw new Error(`Unknown entity type has been provided - ${entity}`);
    }

    if (!this.indexingQueue.has(entityTypeName))
      this.indexingQueue.set(entityTypeName, new Map());

    this.indexingQueue
      .get(entityTypeName)!
      .set(entity.id, this.getContent(entity));
  }

  /**
   * Add content of entities was prepared in previous batch. In such case we can
   * be sure that entities are saved in DB after previous DB transaction commit.
   */
  async processIndexingQueue() {
    for (const [entityType, contentScope] of this.indexingQueue.entries()) {
      switch (entityType) {
        case 'post':
          await this.indexListInBatches(
            contentScope,
            this.esClient.indexPostContent.bind(this.esClient)
          );
          break;
        case 'space':
          await this.indexListInBatches(
            contentScope,
            this.esClient.indexSpaceContent.bind(this.esClient)
          );
          break;
        default:
      }
    }
    this.processorContext.log.info(
      `Added to ElasticSearch: ${
        this.indexingQueue.get('post')!.size
      } posts | ${this.indexingQueue.get('space')!.size} spaces`
    );
    this.indexingQueue.get('post')!.clear();
    this.indexingQueue.get('space')!.clear();
  }

  private getContent<T extends Entity>(entity: T): ContentData<T> {
    if (entity instanceof Post) {
      return {
        ...(entity.space ? { space: entity.space.id } : {}),
        ...(entity.title ? { title: entity.title } : {}),
        ...(entity.body ? { body: entity.body } : {}),
        ...(entity.tagsOriginal && entity.tagsOriginal.length > 0
          ? { tags: entity.tagsOriginal.split(',') }
          : {})
      } as ContentData<T>;
    } else if (entity instanceof Space) {
      return {
        ...(entity.name ? { name: entity.name } : {}),
        ...(entity.handle ? { handle: entity.handle } : {}),
        ...(entity.about ? { body: entity.about } : {}),
        ...(entity.tagsOriginal && entity.tagsOriginal.length > 0
          ? { tags: entity.tagsOriginal.split(',') }
          : {})
      } as ContentData<T>;
    } else {
      throw new Error(`Unknown entity type has been provided - ${entity}`);
    }
  }

  private async indexList(
    list: Map<string, ElasticPostDoc | ElasticSpaceDoc>,
    handler: ({
      id,
      content
    }: {
      id: string;
      content: ElasticPostDoc | ElasticSpaceDoc;
    }) => Promise<
      import('@elastic/elasticsearch').ApiResponse<any, any> | undefined
    >
  ) {
    for (const [id, content] of list.entries()) {
      await handler({ id, content });
    }
  }

  private async indexListInBatches(
    list: Map<string, ElasticPostDoc | ElasticSpaceDoc>,
    handler: ({
      id,
      content
    }: {
      id: string;
      content: ElasticPostDoc | ElasticSpaceDoc;
    }) => Promise<
      import('@elastic/elasticsearch').ApiResponse<any, any> | undefined
    >
  ) {
    for (const batch of splitIntoBatches([...list.entries()], 100)) {
      const promises = batch.map(([id, content]) => handler({ id, content }));

      const indexingRes = await Promise.allSettled(promises);
    }
  }
}
