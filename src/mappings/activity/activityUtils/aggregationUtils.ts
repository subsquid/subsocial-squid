import { Not } from 'typeorm';
import { FindManyOptions } from '@subsquid/typeorm-store/src/store';
import { Account, Space, Post, Activity } from '../../../model';
import { EventName } from '../../../common/types';
import { EventHandlerContext } from '../../../common/contexts';

type GetAggregationCountParams = {
  eventName: EventName;
  post: Post;
  account: Account;
  ctx: EventHandlerContext;
};

type UpdateAggregatedStatusParams = {
  eventName: EventName;
  post?: Post;
  space?: Space;
  followingAccount?: Account;
  ctx: EventHandlerContext;
};

export async function getAggregationCount(
  params: GetAggregationCountParams
): Promise<number> {
  const { eventName, post, account, ctx } = params;
  const findResult = await ctx.store.find(Activity, {
    where: {
      event: eventName,
      post,
      account: {
        id: Not(account.id)
      }
    },
    relations: ['account']
  });

  const uniqueIds = findResult
    .map((actItem) => actItem.id)
    .filter((val, i, arr) => arr.indexOf(val) === i);

  return uniqueIds.length;
}

export async function updateAggregatedStatus(
  params: UpdateAggregatedStatusParams
): Promise<void> {
  const {
    eventName: event,
    post = null,
    space = null,
    followingAccount = null,
    ctx
  } = params;

  let findOptions: FindManyOptions | null = null;

  if (post) {
    findOptions = {
      where: {
        event,
        post: {
          id: post.id,
          rootPost: post.rootPost,
          parentPost: post.parentPost
        }
      },
      relations: ['account', 'post', 'space', 'reaction']
    };
  }
  if (space) {
    findOptions = {
      where: {
        event,
        space
      },
      relations: ['account', 'space', 'spacePrev']
    };
  }
  if (followingAccount) {
    findOptions = {
      where: {
        event,
        followingAccount
      },
      relations: ['account', 'followingAccount']
    };
  }
  if (!findOptions) return;
  const activities = (await ctx.store.find(
    Activity,
    findOptions
  )) as Activity[];
  const activitiesUpdated = [];

  for (const activityItem of activities) {
    activityItem.aggregated = false;
    activitiesUpdated.push(activityItem);
  }

  await ctx.store.save<Activity>(activitiesUpdated);
}
