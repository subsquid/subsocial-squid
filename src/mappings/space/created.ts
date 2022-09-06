import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Space } from '../../model';
import { SpacesSpaceCreatedEvent } from '../../types/generated/events';
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import { processSpaceFollowingUnfollowingRelations } from '../spaceFollows';
import {
  EntityProvideFailWarning,
  CommonCriticalError
} from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { ensureSpace } from './common';

export async function spaceCreated(ctx: EventHandlerContext) {
  const event = new SpacesSpaceCreatedEvent(ctx);
  printEventLog(ctx);

  const { account: accountId, spaceId } = event.asV13;

  const account = await ensureAccount(addressSs58ToString(accountId), ctx);

  const space = await ensureSpace({ space: spaceId.toString(), ctx });

  if (!space) {
    new EntityProvideFailWarning(Space, spaceId.toString(), ctx);
    throw new CommonCriticalError();
    return;
  }
  await ctx.store.save<Space>(space);

  await processSpaceFollowingUnfollowingRelations(account, space, ctx);

  await setActivity({
    account,
    space,
    ctx
  });
}
