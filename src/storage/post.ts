import { PostData, PostWithAllDetails } from '@subsocial/types/dto';
import { resolveSubsocialApi } from '../connection/subsocial';
import { PostWithDetails } from '../common/types';
import { asCommentStruct } from '@subsocial/api/subsocial/flatteners/utils';

export async function resolvePostsData(
  ids: string[]
): Promise<Map<string, PostWithDetails> | null> {
  const api = await resolveSubsocialApi();
  const respList = await api.findPostsWithAllDetails({ ids });

  return new Map<string, PostWithDetails>(
    // @ts-ignore
    respList.map((dataItem) => {
      const decorated = { ...dataItem };
      decorated.post.struct = {
        ...decorated.post.struct,
        ...asCommentStruct(dataItem.post.struct)
      };
      return [dataItem.id, decorated];
    })
  );
}
