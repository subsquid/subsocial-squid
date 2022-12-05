import { Ctx } from "../../processor";
import { ParsedEventsDataScope } from "../../common/eventsData";
import { EventName } from "../../model";
import { getOrderedListByBlockNumber } from "../../common/utils";
import { accountUpdated } from './updated';

export { ensureAccount } from './common';


export async function handleProfiles(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const accountUpdatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.ProfileUpdated).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(accountUpdatedEvents)) {
    await accountUpdated(ctx, eventData);
  }
}