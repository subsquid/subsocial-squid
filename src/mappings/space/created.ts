import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Space } from '../../model';
import { SpacesSpaceCreatedEvent } from '../../types/generated/events';
import { getOrCreateAccount } from '../account';
import { setActivity } from '../activity';
import { processSpaceFollowingUnfollowingRelations } from '../spaceFollows';
import {
  EntityProvideFailWarning,
  CommonCriticalError
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { Ctx } from '../../processor';
import { ensureSpace } from './common';
import { SpaceCreatedData } from '../../common/types';

// export async function spaceCreated(ctx: EventHandlerContext) {
//   const event = new SpacesSpaceCreatedEvent(ctx);
//   printEventLog(ctx);
//
//   const { account: accountId, spaceId } = event.asV13;
//
//   const account = await getOrCreateAccount(addressSs58ToString(accountId), ctx);
//
//   const space = await ensureSpace({ space: spaceId.toString(), ctx });
//
//   if (!space) {
//     new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
//     throw new CommonCriticalError();
//     return;
//   }
//   await ctx.store.save<Space>(space);
//
//   await processSpaceFollowingUnfollowingRelations(account, space, ctx);
//
//   await setActivity({
//     account,
//     space,
//     ctx
//   });
// }

export async function spaceCreated(ctx: Ctx, eventData: SpaceCreatedData) {
  const account = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    '5348ae2e-d429-4f3b-b125-a51b90423b40'
  );

  const space = await ensureSpace({
    spaceId: eventData.spaceId,
    ctx,
    eventData
  });

  await ctx.store.save(space);

  await processSpaceFollowingUnfollowingRelations(
    account,
    space,
    ctx,
    eventData
  );

  await setActivity({
    account,
    space,
    ctx,
    eventData
  });
}
