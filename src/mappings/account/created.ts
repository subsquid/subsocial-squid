import { Account } from '../../model';
import { ProfilesProfileCreatedEvent } from '../../types/generated/events';
import {
  addressSs58ToString,
  validateEventHandlerInputs,
  printEventLog
} from '../../common/utils';
import { setActivity } from '../activity';
import { ensureAccount } from './common';
import { EventHandlerContext } from '../../common/contexts';

export async function accountCreated(ctx: EventHandlerContext): Promise<void> {
  printEventLog(ctx);
  const event = new ProfilesProfileCreatedEvent(ctx);

  validateEventHandlerInputs(ctx);

  const accountIdString = addressSs58ToString(event.asV1);

  const account: Account | null = await ensureAccount(accountIdString, ctx);

  if (account) {
    await ctx.store.save<Account>(account);
    await setActivity({
      account,
      ctx
    });
  }
}
