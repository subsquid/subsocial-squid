import { Ctx } from "../../processor";
import { ParsedEventsDataScope } from "../../eventsCallsData";
import { EventName } from "../../model";
import { getOrderedListByBlockNumber } from "../../common/utils";

import { postCreated } from './created';
import { postUpdated } from './updated';
import { postMoved } from './moved';
export { ensurePost } from './common';


export async function handlePosts(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const postCreatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostCreated).values()
  ];
  const postUpdatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostUpdated).values()
  ];
  const postMovedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.PostMoved).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(postCreatedEvents)) {
    await postCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(postUpdatedEvents)) {
    await postUpdated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(postMovedEvents)) {
    await postMoved(ctx, eventData);
  }
}