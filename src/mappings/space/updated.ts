import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Reaction, Space } from '../../model';
import { SpacesSpaceUpdatedEvent } from '../../types/generated/events';
import { setActivity } from '../activity';
import {
  CommonCriticalError,
  EntityProvideFailWarning,
  MissingSubsocialApiEntity
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { ensureSpace } from './common';
import { resolveSpace } from '../../connection/resolvers/resolveSpaceData';
import BN from 'bn.js';

export async function spaceUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new SpacesSpaceUpdatedEvent(ctx);
  printEventLog(ctx);

  const { account: accountId, spaceId } = event.asV13;

  const space = await ensureSpace({
    space: spaceId.toString(),
    ctx
  });

  if (!space) {
    new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
    throw new CommonCriticalError();
  }

  const spaceDataSSApi = await resolveSpace(new BN(spaceId.toString(), 10));
  if (!spaceDataSSApi) {
    new MissingSubsocialApiEntity('SpaceData', ctx);
    throw new CommonCriticalError();
  }

  const { struct: spaceStruct } = spaceDataSSApi;

  if (
    spaceStruct.updatedAtTime &&
    space.updatedAtTime === new Date(spaceStruct.updatedAtTime)
  )
    return;

  space.updatedAtTime = spaceStruct.updatedAtTime
    ? new Date(spaceStruct.updatedAtTime)
    : null;
  space.updatedAtBlock = spaceStruct.updatedAtBlock
    ? BigInt(spaceStruct.updatedAtBlock)
    : BigInt(ctx.block.height.toString());

  await ctx.store.save<Space>(space);

  await setActivity({
    account: addressSs58ToString(accountId),
    space,
    ctx
  });
}
