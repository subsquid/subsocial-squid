import { AccountFollowsAccountFollowedEvent } from '../../types/generated/events';
import { addressSs58ToString, printEventLog } from '../../common/utils';
import { Ctx } from '../../processor';
import { handleEvent } from './common';
import { AccountFollowedData, PostCreatedData } from "../../common/types";

export async function accountFollowed(ctx: Ctx, eventData: AccountFollowedData): Promise<void> {

  await handleEvent(
    eventData.followerId,
    eventData.accountId,
    ctx,
    eventData
  );
}
