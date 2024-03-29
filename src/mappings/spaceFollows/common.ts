import {
  Account,
  Activity,
  Space,
  SpaceFollowers,
  EventName
} from '../../model';
import {
  getSpaceFollowersEntityId,
  decorateEventName,
  ensurePositiveOrZeroValue
} from '../../common/utils';
import { getOrCreateAccount } from '../account';
import { setActivity } from '../activity';
import { deleteSpacePostsFromFeedForAccount } from '../newsFeed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutSpace
} from '../notification';
import { EntityProvideFailWarning } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { EventData } from '../../common/types';
import { Ctx } from '../../processor';
import { getEntityWithRelations } from '../../common/gettersWithRelations';

export async function handleEvent(
  followerId: string,
  spaceId: string,
  ctx: Ctx,
  eventData: EventData
): Promise<void> {
  const { name: eventName } = eventData;
  const followerAccount = await getOrCreateAccount(
    followerId,
    ctx,
    'e61e74cc-7e24-4452-b303-8c5b25fcfae1'
  );
  const eventNameDecorated = decorateEventName(eventName);

  let { followingSpacesCount } = followerAccount;

  const space = await getEntityWithRelations.space(spaceId, ctx);
  if (!space) {
    new EntityProvideFailWarning(Space, spaceId, ctx, eventData);
    return;
  }
  await processSpaceFollowingUnfollowingRelations(
    followerAccount,
    space,
    ctx,
    eventData
  );

  const activity = await setActivity({
    account: followerAccount,
    ctx,
    space,
    eventData
  });
  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx, eventData);
    return;
  }

  if (eventNameDecorated === EventName.SpaceFollowed) {
    await addNotificationForAccount(space.ownedByAccount, activity, ctx);
    followingSpacesCount = !followingSpacesCount ? 1 : followingSpacesCount + 1;
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    await deleteSpacePostsFromFeedForAccount(activity.account.id, space, ctx);
    await deleteAllNotificationsAboutSpace(followerAccount.id, space, ctx);
    followingSpacesCount = ensurePositiveOrZeroValue(followingSpacesCount - 1);
  }
  followerAccount.followingSpacesCount = followingSpacesCount;
  await ctx.store.save(followerAccount);
}

export async function processSpaceFollowingUnfollowingRelations(
  follower: Account | string,
  space: Space,
  ctx: Ctx,
  eventData: EventData
): Promise<void> {
  if (!space) return;
  const followerAccountInst =
    follower instanceof Account
      ? follower
      : await getOrCreateAccount(
          follower,
          ctx,
          'c50dd256-f497-44ce-9a50-d23fdbcc3667'
        );

  const { name: eventName } = eventData;
  const eventNameDecorated = decorateEventName(eventName);

  const spaceFollowersEntityId = getSpaceFollowersEntityId(
    followerAccountInst.id,
    space.id
  );

  const spaceFollowers = await ctx.store.get(
    SpaceFollowers,
    spaceFollowersEntityId
  );

  let currentSpaceFollowersCount = space.followersCount || 0;

  if (
    eventNameDecorated === EventName.SpaceFollowed ||
    eventNameDecorated === EventName.SpaceCreated
  ) {
    if (spaceFollowers) return;
    currentSpaceFollowersCount += 1;

    const newSpaceFollowersEnt = new SpaceFollowers();

    newSpaceFollowersEnt.id = spaceFollowersEntityId;
    newSpaceFollowersEnt.followerAccount = followerAccountInst;
    newSpaceFollowersEnt.followingSpace = space;

    await ctx.store.save(newSpaceFollowersEnt);
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    if (!spaceFollowers) return;
    currentSpaceFollowersCount -= 1;
    await ctx.store.remove(SpaceFollowers, spaceFollowers.id);
  }

  space.followersCount = currentSpaceFollowersCount;

  await ctx.store.save(space);
}
