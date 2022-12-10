import { Ctx } from '../processor';
import { Account, Post, Space } from '../model';

async function getAccountWithRelations(
  accountId: string,
  ctx: Ctx
): Promise<Account | null> {
  return (
    (await ctx.store.get(Account, {
      where: {
        id: accountId
      },
      relations: {
        profileSpace: true
      }
    })) ?? null
  );
}

async function getPostWithRelations({
  postId,
  ctx,
  rootOrParentPost
}: {
  postId: string | undefined | null;
  ctx: Ctx;
  rootOrParentPost?: boolean;
}): Promise<Post | null> {
  if (!postId) return null;
  return (
    (await ctx.store.get(Post, {
      where: {
        id: postId
      },
      relations: {
        ...(rootOrParentPost
          ? { ownedByAccount: true }
          : {
              ownedByAccount: true,
              rootPost: {
                ownedByAccount: true,
                space: true
              },
              parentPost: {
                ownedByAccount: true
              },
              space: {
                ownedByAccount: true
              }
            })
      }
    })) ?? null
  );
}

async function getSpaceWithRelations(
  spaceId: string | null | undefined,
  ctx: Ctx
): Promise<Space | null> {
  if (!spaceId) return null;
  return (
    (await ctx.store.get(Space, {
      where: {
        id: spaceId
      },
      relations: {
        ownedByAccount: true
      }
    })) ?? null
  );
}

export const getEntityWithRelations = {
  account: getAccountWithRelations,
  post: getPostWithRelations,
  space: getSpaceWithRelations
};
