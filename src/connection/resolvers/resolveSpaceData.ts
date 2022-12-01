import { resolveSubsocialApi } from '../subsocial';
import { AnySpaceId, AnyAccountId } from '@subsocial/types';
import { SpaceData } from '@subsocial/types/dto';
import { IpfsCid, IpfsCommonContent } from "@subsocial/api/types/ipfs";
import { ContentResult } from "@subsocial/api/types";

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

export const resolveSpaceIPFSContentByCid = async (
  idOrList: IpfsCid[]
): Promise<ContentResult<IpfsCommonContent>> => {
  const subsocial = await resolveSubsocialApi();
  //@ts-ignore
  return subsocial.ipfs.getContentArrayFromIpfs(idOrList);
};

//
// export const resolveSpaceStruct = async (
//   id: AnySpaceId
// ): Promise<SpaceStruct | undefined> => {
//   const subsocial = await resolveSubsocialApi();
//
//   return await subsocial.findSpaceStruct(id.toString());
// };
