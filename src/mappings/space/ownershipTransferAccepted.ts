import { Space } from '../../model';
import {
  CommonCriticalError,
  EntityProvideFailWarning
} from '../../common/errors';
import { Ctx } from '../../processor';
import { SpaceOwnershipTransferAcceptedData } from '../../common/types';
import { setActivity } from '../activity';
import { getEntityWithRelations } from '../../common/gettersWithRelations';
import { getOrCreateAccount } from '../account';

export async function spaceOwnershipTransferAccepted(
  ctx: Ctx,
  eventData: SpaceOwnershipTransferAcceptedData
): Promise<void> {
  const newOwnerAccount = await getOrCreateAccount(eventData.accountId, ctx);

  const space = await getEntityWithRelations.space(eventData.spaceId, ctx);

  if (!space) {
    new EntityProvideFailWarning(Space, eventData.spaceId, ctx, eventData);
    throw new CommonCriticalError();
  }

  const oldOwnerAccount = space.ownedByAccount;

  space.ownedByAccount = newOwnerAccount;

  await ctx.store.save(space);

  await setActivity({
    account: eventData.accountId,
    oldOwner: oldOwnerAccount,
    space,
    ctx,
    eventData
  });
}
