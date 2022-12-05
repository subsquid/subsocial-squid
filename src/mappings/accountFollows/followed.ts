import { Ctx } from '../../processor';
import { handleEvent } from './common';
import { AccountFollowedData } from "../../common/types";

export async function accountFollowed(ctx: Ctx, eventData: AccountFollowedData): Promise<void> {

  await handleEvent(
    eventData.followerId,
    eventData.accountId,
    ctx,
    eventData
  );
}
