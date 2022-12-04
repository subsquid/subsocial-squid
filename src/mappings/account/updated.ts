import { Account, Space } from '../../model';
import { ProfilesProfileUpdatedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
// import { resolveAccount } from '../../connection/resolvers/resolveAccountData';
import { setActivity } from '../activity';
import { ensureAccount } from './common';
import { MissingSubsocialApiEntity } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';

export async function accountUpdated(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfilesProfileUpdatedEvent(ctx);

  const { account: accountId, spaceId } = event.asV13;

  const accountIdString = addressSs58ToString(accountId);

  // @ts-ignore
  const account = await ensureAccount(accountIdString, ctx);

  account.updatedAtTime = new Date(ctx.block.timestamp);
  account.updatedAtBlock = BigInt(ctx.block.height.toString());

  if (
    (spaceId && !account.profileSpace) ||
    (spaceId &&
      account.profileSpace &&
      account.profileSpace.id !== spaceId.toString())
  ) {
    const accountSpace = await ctx.store.get(Space, spaceId.toString());

    account.profileSpace = accountSpace;

    await ctx.store.save<Account>(account);

    if (accountSpace) {
      accountSpace.profileSpace = account;
      await ctx.store.save<Space>(accountSpace);
    }
  } else {
    await ctx.store.save<Account>(account);
  }

  await setActivity({
    account,
    ctx
  });
}
