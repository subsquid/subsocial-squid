import { resolveSubsocialApi } from '../subsocial';
import { AnySpaceId, AnyAccountId } from '@subsocial/types';
import { SpaceData } from '@subsocial/types/dto';

export const resolveSpace = async (
  id: AnySpaceId
): Promise<SpaceData | undefined> => {
  const subsocial = await resolveSubsocialApi();
  //@ts-ignore
  return subsocial.findSpace({ id });
};
export const resolveSpaceHandle = async (
  id: AnySpaceId,
  ownerId: AnyAccountId
): Promise<string | undefined> => {
  const subsocial = await resolveSubsocialApi();
  //@ts-ignore
  return subsocial.blockchain.domainNameBySpaceId(ownerId, id);
};

//
// export const resolveSpaceStruct = async (
//   id: AnySpaceId
// ): Promise<SpaceStruct | undefined> => {
//   const subsocial = await resolveSubsocialApi();
//
//   return await subsocial.findSpaceStruct(id.toString());
// };
