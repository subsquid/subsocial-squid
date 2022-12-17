import { Ctx } from '../../processor';
import { ParsedEventsDataScope } from '../../eventsCallsData';
import { EventName } from '../../model';
import { getOrderedListByBlockNumber } from '../../common/utils';

export { updatePostsCountersInSpace } from './common';
import { spaceCreated } from './created';
import { spaceUpdated } from './updated';
import { spaceOwnershipTransferAccepted } from './ownershipTransferAccepted';

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
  const spaceOwnershipTransferAcceptedEvents = [
    ...parsedEvents
      .getSectionByEventName(EventName.SpaceOwnershipChangeAccepted)
      .values()
  ];

  for (const eventData of getOrderedListByBlockNumber(spaceCreatedEvents)) {
    await spaceCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(spaceUpdatedEvents)) {
    await spaceUpdated(ctx, eventData);
  }
  for (const eventData of getOrderedListByBlockNumber(
    spaceOwnershipTransferAcceptedEvents
  )) {
    await spaceOwnershipTransferAccepted(ctx, eventData);
  }
}
