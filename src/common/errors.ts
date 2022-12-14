import { DbEntity, EventData } from './types';
import { Ctx } from '../processor';

export class UnknownVersionError extends Error {
  constructor(name: string) {
    super(`There is no relevant version for ${name}`);
  }
}

export class CommonCriticalError extends Error {
  constructor(msg = 'Processor has been terminated') {
    super(msg);
  }
}

export class EntityProvideFailWarning {
  constructor(entity: DbEntity, entityId: string, ctx: Ctx, event: EventData) {
    const msg = `WARNING ::: Entity ${entity.name} (id: ${entityId}) can not be provided at block ${event.blockNumber}[e# - ${event.indexInBlock}], method "${event.name}"`;
    ctx.log.warn(msg);
  }
}

export class MissingSubsocialApiEntity {
  constructor(entityName: string, ctx: Ctx, event: EventData) {
    const msg = `WARNING ::: Missing Subsocial API record for ${entityName} at block ${event.blockNumber}, method "${event.name}"`;
    ctx.log.warn(msg);
  }
}
