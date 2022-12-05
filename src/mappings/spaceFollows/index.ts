import { Ctx } from '../../processor';
import { ParsedEventsDataScope } from '../../common/eventsData';
import { EventName } from '../../model';
import { getOrderedListByBlockNumber } from '../../common/utils';

import { processSpaceFollowingUnfollowingRelations } from './common';
import { spaceFollowed } from './followed';
import { spaceUnfollowed } from './unfollowed';

export { processSpaceFollowingUnfollowingRelations } from './common';

export async function handleSpacesFollowing(
  ctx: Ctx,
  parsedEvents: ParsedEventsDataScope
) {
  const spaceFollowedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.SpaceFollowed).values()
  ];
  const spaceUnfollowedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.SpaceUnfollowed).values()
  ];

  for (const eventData of getOrderedListByBlockNumber(spaceFollowedEvents)) {
    await spaceFollowed(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(spaceUnfollowedEvents)) {
    await spaceUnfollowed(ctx, eventData);
  }
}
