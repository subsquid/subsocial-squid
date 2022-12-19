import { getOrCreateAccount } from '../account';
import { setActivity } from '../activity';
import { processSpaceFollowingUnfollowingRelations } from '../spaceFollows';
import { Ctx } from '../../processor';
import { ensureSpace } from './common';
import { SpaceCreatedData } from '../../common/types';
import { ElasticSearchIndexerManager } from '../../elasticsearch';


export async function spaceCreated(ctx: Ctx, eventData: SpaceCreatedData) {
  const account = await getOrCreateAccount(
    eventData.accountId,
    ctx,
    '5348ae2e-d429-4f3b-b125-a51b90423b40'
  );

  const space = await ensureSpace({
    spaceId: eventData.spaceId,
    ctx,
    eventData
  });

  await ctx.store.save(space);

  ElasticSearchIndexerManager.getInstance(ctx).addToQueue(space);

  await processSpaceFollowingUnfollowingRelations(
    account,
    space,
    ctx,
    eventData
  );

  await setActivity({
    account,
    space,
    ctx,
    eventData
  });
}
