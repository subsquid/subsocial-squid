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
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import { deleteSpacePostsFromFeedForAccount } from '../newsFeed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutSpace
} from '../notification';
import { EntityProvideFailWarning } from '../../common/errors';
import { EventHandlerContext } from '../../common/contexts';
import { Ctx } from '../../processor';
import { EventData } from '../../common/types';

export async function handleEvent(
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
): Promise<void> {
  const { name: eventName } = ctx.event;
  // @ts-ignore
  const followerAccount = await ensureAccount(followerId, ctx);
  const eventNameDecorated = decorateEventName(eventName);

  let { followingSpacesCount } = followerAccount;

  const space = await ctx.store.get(Space, {
    where: { id: spaceId },
    relations: { ownedByAccount: true }
  });
  if (!space) {
    // @ts-ignore
    new EntityProvideFailWarning(Space, spaceId, ctx);
    return;
  }
  // @ts-ignore
  await processSpaceFollowingUnfollowingRelations(followerAccount, space, ctx);

  const activity = await setActivity({
    account: followerAccount,
    ctx,
    space
  });
  if (!activity) {
    // @ts-ignore
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }

  if (eventNameDecorated === EventName.SpaceFollowed) {
    await addNotificationForAccount(space.ownedByAccount, activity, ctx);
    followingSpacesCount = !followingSpacesCount ? 1 : followingSpacesCount + 1;
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    await deleteSpacePostsFromFeedForAccount(activity.account, space, ctx);
    await deleteAllNotificationsAboutSpace(followerAccount, space, ctx);
    followingSpacesCount = ensurePositiveOrZeroValue(followingSpacesCount - 1);
  }
  followerAccount.followingSpacesCount = followingSpacesCount;
  await ctx.store.save<Account>(followerAccount);
}

export async function processSpaceFollowingUnfollowingRelations(
  follower: Account | string,
  space: Space,
  ctx: Ctx,
  eventData: EventData
): Promise<void> {
  if (!space) return;
  const followerAccountInst =
    follower instanceof Account ? follower : await ensureAccount(follower, ctx);

  const { name: eventName } = eventData;
  const eventNameDecorated = decorateEventName(eventName);

  const spaceFollowersEntityId = getSpaceFollowersEntityId(
    followerAccountInst.id,
    space.id
  );

  const spaceFollowers = await ctx.store.get(
    SpaceFollowers,
    spaceFollowersEntityId,
    false
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

    await ctx.store.deferredUpsert(newSpaceFollowersEnt);
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    if (!spaceFollowers) return;
    currentSpaceFollowersCount -= 1;
    await ctx.store.deferredRemove(SpaceFollowers, spaceFollowers.id);
  }

  space.followersCount = currentSpaceFollowersCount;

  ctx.store.deferredUpsert(space);
}
