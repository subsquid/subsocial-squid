import { Account, Activity, Space, SpaceFollowers } from '../../model';
import { getSpaceFollowersEntityId, decorateEventName } from '../../common/utils';
import { ensureAccount } from '../account';
import { setActivity } from '../activity';
import { deleteSpacePostsFromFeedForAccount } from '../newsFeed';
import {
  addNotificationForAccount,
  deleteAllNotificationsAboutSpace
} from '../notification';
import { EntityProvideFailWarning } from '../../common/errors';
import { EventName } from '../../common/types';
import { EventHandlerContext } from '../../common/contexts';

export async function handleEvent(
  followerId: string,
  spaceId: string,
  ctx: EventHandlerContext
): Promise<void> {
  const { name: eventName } = ctx.event;
  const followerAccount = await ensureAccount(followerId, ctx);
  const eventNameDecorated = decorateEventName(eventName);

  if (!followerAccount) {
    new EntityProvideFailWarning(Account, followerId, ctx);
    return;
  }
  let { followingSpacesCount } = followerAccount;

  const space = await ctx.store.get(Space, {
    where: { id: spaceId },
    relations: ['ownerAccount', 'createdByAccount']
  });
  if (!space) {
    new EntityProvideFailWarning(Space, spaceId, ctx);
    return;
  }
  await processSpaceFollowingUnfollowingRelations(followerAccount, space, ctx);

  const activity = await setActivity({
    account: followerAccount,
    ctx,
    space
  });
  if (!activity) {
    new EntityProvideFailWarning(Activity, 'new', ctx);
    return;
  }

  if (eventNameDecorated === EventName.SpaceFollowed) {
    await addNotificationForAccount(space.ownerAccount, activity, ctx);
    followingSpacesCount = !followingSpacesCount ? 1 : followingSpacesCount + 1;
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    await deleteSpacePostsFromFeedForAccount(activity.account, space, ctx);
    await deleteAllNotificationsAboutSpace(followerAccount, space, ctx);
    followingSpacesCount = !followingSpacesCount ? 0 : followingSpacesCount - 1;
  }
  followerAccount.followingSpacesCount = followingSpacesCount;
  await ctx.store.save<Account>(followerAccount);
}

export async function processSpaceFollowingUnfollowingRelations(
  follower: Account | string,
  space: Space,
  ctx: EventHandlerContext
): Promise<void> {
  if (!space) return;
  const followerAccountInst =
    follower instanceof Account ? follower : await ensureAccount(follower, ctx);
  if (!followerAccountInst) return;

  const { name: eventName } = ctx.event;
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

    await ctx.store.save<SpaceFollowers>(newSpaceFollowersEnt);
  } else if (eventNameDecorated === EventName.SpaceUnfollowed) {
    if (!spaceFollowers) return;
    currentSpaceFollowersCount -= 1;
    await ctx.store.remove<SpaceFollowers>(spaceFollowers);
  }

  space.followersCount = currentSpaceFollowersCount;

  await ctx.store.save<Space>(space);
}
