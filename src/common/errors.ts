import { DbEntity } from './types';
import { warningLogsTrace } from '../env';
import { EventHandlerContext } from './contexts';

export class UnknownVersionError extends Error {
  constructor(name: string) {
    super(`There is no relevant version for ${name}`);
  }
}

export class CommonCriticalError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class MissingDbRecord {
  constructor(entity: DbEntity, ctx: EventHandlerContext) {
    const msg = `WARNING ::: Missing record for ${entity.name} in database at block ${ctx.block.height}, method "${ctx.event.name}"`;
    if (warningLogsTrace === 'true') {
      console.trace(msg);
    } else {
      console.warn(msg);
    }
  }
}

export class EntityProvideFailWarning {
  constructor(entity: DbEntity, entityId: string, ctx: EventHandlerContext) {
    const msg = `WARNING ::: Entity ${entity.name} (id: ${entityId}) can not be provided at block ${ctx.block.height}, method "${ctx.event.name}"`;
    if (warningLogsTrace === 'true') {
      console.trace(msg);
    } else {
      console.warn(msg);
    }
  }
}

export class MissingSubsocialApiEntity {
  constructor(entityName: string, ctx: EventHandlerContext) {
    const msg = `WARNING ::: Missing Subsocial API record for ${entityName} at block ${ctx.block.height}, method "${ctx.event.name}"`;
    if (warningLogsTrace === 'true') {
      console.trace(msg);
    } else {
      console.warn(msg);
    }
  }
}
