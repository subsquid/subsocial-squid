import { Ctx } from "../../processor";
import { ParsedEventsDataScope } from "../../eventsCallsData";
import { EventName } from "../../model";
import { getOrderedListByBlockNumber } from "../../common/utils";

import { postReactionCreated } from './created';
import { postReactionUpdated } from './updated';
import { postReactionDeleted } from './deleted';



export async function handlePostReactions(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const reactionCreatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostReactionCreated).values()
  ];
  const reactionUpdatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostReactionUpdated).values()
  ];
  const reactionDeletedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostReactionDeleted).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(reactionCreatedEvents)) {
    await postReactionCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(reactionUpdatedEvents)) {
    await postReactionUpdated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(reactionDeletedEvents)) {
    await postReactionDeleted(ctx, eventData);
  }
}