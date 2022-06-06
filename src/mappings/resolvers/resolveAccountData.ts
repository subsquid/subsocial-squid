import { resolveSubsocialApi } from '../../connection/subsocial';
import { AnyAccountId /* , MetaItem */ } from '@subsocial/types';
import { ProfileStruct, ProfileData } from '@subsocial/types/dto';

export const resolveAccount = async (
  id: AnyAccountId
): Promise<ProfileData | undefined> => {
  const subsocial = await resolveSubsocialApi();

  return subsocial.findProfile(id);
};

export const resolveAccountStruct = async (
  id: AnyAccountId
): Promise<ProfileStruct | undefined> => {
  const subsocial = await resolveSubsocialApi();

  return subsocial.findProfileStruct(id.toString());
};
