import { resolveSubsocialApi } from '../subsocial';
import { AnySpaceId } from '@subsocial/types';
import { SpaceData, SpaceStruct } from '@subsocial/types/dto';

export const resolveSpace = async (
  id: AnySpaceId
): Promise<SpaceData | undefined> => {
  const subsocial = await resolveSubsocialApi();

  return await subsocial.findSpace({ id });
};

export const resolveSpaceStruct = async (
  id: AnySpaceId
): Promise<SpaceStruct | undefined> => {
  const subsocial = await resolveSubsocialApi();

  return await subsocial.findSpaceStruct(id.toString());
};
