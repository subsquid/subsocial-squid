import assert from 'assert';
import { Not } from 'typeorm';
import { FindManyOptions } from '@subsquid/typeorm-store/src/store';
import { Account, Space, Post, Activity, EventName } from '../../../model';
import { Ctx } from '../../../processor';

type GetAggregationCountParams = {
  eventName: EventName;
  postId: string;
  accountId: string;
  ctx: Ctx;
};

type UpdateAggregatedStatusParams = {
  eventName: EventName;
  post?: Post;
  space?: Space;
  followingAccount?: Account;
  ctx: Ctx;
};

export async function getAggregationCount(
  params: GetAggregationCountParams
): Promise<number> {
  const { eventName, postId, accountId, ctx } = params;

  return await ctx.store.count(Activity, {
    where: {
      event: eventName,
      post: { id: postId },
      account: {
        id: Not(accountId)
      }
    }
  });

  // const uniqueIds = findResult
  //   .map((actItem) => actItem.id)
  //   .filter((val, i, arr) => arr.indexOf(val) === i);
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
          id: post.id
        }
      }
    };
  }
  if (space && space.id) {
    findOptions = {
      where: {
        event,
        space: {
          id: space.id
        }
      }
    };
  }
  if (followingAccount && followingAccount.id) {
    findOptions = {
      where: {
        event,
        followingAccount: {
          id: followingAccount.id
        }
      }
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

  await ctx.store.save(activitiesUpdated);
}

//
// type GetAggregationCountParams = {
//   eventName: EventName;
//   post: Post;
//   account: Account;
//   ctx: EventHandlerContext;
// };
//
// type UpdateAggregatedStatusParams = {
//   eventName: EventName;
//   post?: Post;
//   space?: Space;
//   followingAccount?: Account;
//   ctx: EventHandlerContext;
// };
//
// export async function getAggregationCount(
//   params: GetAggregationCountParams
// ): Promise<number> {
//   const { eventName, post, account, ctx } = params;
//   const findResult = await ctx.store.find(Activity, {
//     where: {
//       event: eventName,
//       post: { id: post.id },
//       account: {
//         id: Not(account.id)
//       }
//     },
//     relations: {
//       account: true,
//       post: true
//     }
//   });
//
//   const uniqueIds = findResult
//     .map((actItem) => actItem.id)
//     .filter((val, i, arr) => arr.indexOf(val) === i);
//
//   return uniqueIds.length;
// }
//
// export async function updateAggregatedStatus(
//   params: UpdateAggregatedStatusParams
// ): Promise<void> {
//   const {
//     eventName: event,
//     post = null,
//     space = null,
//     followingAccount = null,
//     ctx
//   } = params;
//
//   let findOptions: FindManyOptions | null = null;
//
//   if (post) {
//     findOptions = {
//       where: {
//         event,
//         post: {
//           id: post.id,
//           rootPost: post.rootPost,
//           parentPost: post.parentPost
//         }
//       },
//       relations: { account: true, post: true, space: true, reaction: true }
//     };
//   }
//   if (space) {
//     findOptions = {
//       where: {
//         event,
//         space
//       },
//       relations: { account: true, space: true, spacePrev: true }
//     };
//   }
//   if (followingAccount) {
//     findOptions = {
//       where: {
//         event,
//         followingAccount
//       },
//       relations: { account: true, followingAccount: true }
//     };
//   }
//   if (!findOptions) return;
//   const activities = (await ctx.store.find(
//     Activity,
//     findOptions
//   )) as Activity[];
//   const activitiesUpdated = [];
//
//   for (const activityItem of activities) {
//     activityItem.aggregated = false;
//     activitiesUpdated.push(activityItem);
//   }
//
//   await ctx.store.save<Activity>(activitiesUpdated);
// }
