import { Account } from '../../model';
// import { ProfilesProfileCreatedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { setActivity } from '../activity';
import { ensureAccount } from './common';
import { EventHandlerContext } from '../../common/contexts';

export async function accountCreated(ctx: EventHandlerContext): Promise<void> {
  // printEventLog(ctx);
  // const event = new ProfilesProfileCreatedEvent(ctx);
  //
  // const accountIdString = addressSs58ToString(event.asV1);
  //
  // const account: Account = await ensureAccount(accountIdString, ctx);
  //
  // await setActivity({
  //   account,
  //   ctx
  // });
}
