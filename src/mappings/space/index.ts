import { Ctx } from '../../processor';
import { ParsedEventsDataScope } from '../../common/eventsData';
import { EventName } from '../../model';
import { getOrderedListByBlockNumber } from '../../common/utils';
import { SpaceCreatedData, SpaceUpdatedData } from '../../common/types';

export { updatePostsCountersInSpace } from './common';
import { spaceCreated } from './created';
import { spaceUpdated } from './updated';

export async function handleSpaces(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const spaceCreatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.SpaceCreated).values()
  ];
  const spaceUpdatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.SpaceUpdated).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(spaceCreatedEvents)) {
    await spaceCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(spaceUpdatedEvents)) {
    await spaceUpdated(ctx, eventData);
  }
}
