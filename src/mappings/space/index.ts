import { Ctx } from '../../processor';
import { ParsedEventsDataScope } from '../../common/eventsData';
import { EventName } from '../../model';
import { getOrderedListByBlockNumber } from '../../common/utils';
import { SpaceCreatedData, SpaceUpdatedData } from '../../common/types';
import { spaceCreated } from './created';

export { updatePostsCountersInSpace } from './common';
export { spaceCreated } from './created';
export { spaceUpdated } from './updated';

export async function handleSpace(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const spaceCreatedEvents = [
    ...parsedEvents
      .getSectionByEventName<SpaceCreatedData>(EventName.SpaceCreated)
      .values()
  ];
  const spaceUpdatedEvents = [
    ...parsedEvents
      .getSectionByEventName<SpaceUpdatedData>(EventName.SpaceUpdated)
      .values()
  ];

  for (const eventData of getOrderedListByBlockNumber(spaceCreatedEvents)) {
    await spaceCreated(ctx, eventData);
  }
}
