import { accountFollowed } from './followed';
import { accountUnfollowed } from './unfollowed';
import { Ctx } from "../../processor";
import { ParsedEventsDataScope } from "../../eventsCallsData";
import { EventName } from "../../model";
import { getOrderedListByBlockNumber } from "../../common/utils";


export async function handleAccountFollowing(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const accountFollowedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.AccountFollowed).values()
  ];
  const accountUnfollowedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.AccountUnfollowed).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(accountFollowedEvents)) {
    await accountFollowed(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(accountUnfollowedEvents)) {
    await accountUnfollowed(ctx, eventData);
  }
}