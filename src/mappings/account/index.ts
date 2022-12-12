import { Ctx } from "../../processor";
import { ParsedEventsDataScope } from "../../eventsCallsData";
import { EventName } from "../../model";
import { getOrderedListByBlockNumber } from "../../common/utils";
import { accountUpdated } from './updated';

export { getOrCreateAccount } from './common';


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