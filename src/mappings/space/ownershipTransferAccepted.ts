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
  const newOwnerAccount = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    '5348ae2e-d429-4v3b-b125-a51b90477b40'
  );

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
