import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Space } from '../../model';
import { SpacesSpaceUpdatedEvent } from '../../types/generated/events';
import { setActivity } from '../activity';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { ensureSpace } from './common';

export async function spaceUpdated(ctx: EventHandlerContext): Promise<void> {
  const event = new SpacesSpaceUpdatedEvent(ctx);
  printEventLog(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`);
  }

  const [accountId, spaceId] = event.asV1;

  const spaceExtData = await ensureSpace({
    space: spaceId.toString(),
    ctx,
    isExtendedData: true
  });

  if (
    !spaceExtData ||
    !('struct' in spaceExtData) ||
    !('content' in spaceExtData)
  ) {
    new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
    new CommonCriticalError();
    return;
  }

  const { space, struct: spaceStruct } = spaceExtData;

  if (!spaceStruct) return;

  if (
    spaceStruct.updatedAtTime &&
    space.updatedAtTime === new Date(spaceStruct.updatedAtTime)
  )
    return;

  space.updatedAtTime = spaceStruct.updatedAtTime
    ? new Date(spaceStruct.updatedAtTime)
    : null;
  await ctx.store.save<Space>(space);

  await setActivity({
    account: addressSs58ToString(accountId),
    space,
    ctx
  });
}
