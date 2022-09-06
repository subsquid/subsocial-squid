import { resolveSubsocialApi } from '../subsocial';
import { AnyPostId /* , MetaItem */ } from '@subsocial/types';
import { PostStruct, PostWithSomeDetails } from '@subsocial/types/dto';

export const resolvePost = async (
  id: AnyPostId
): Promise<PostWithSomeDetails | undefined> => {
  const subsocial = await resolveSubsocialApi();
  //@ts-ignore
  return subsocial.findPostWithSomeDetails({ id });
};

export const resolvePostStruct = async (
  id: AnyPostId
): Promise<PostStruct | undefined> => {
  const subsocial = await resolveSubsocialApi();
  //@ts-ignore
  return subsocial.findPostStruct(id.toString());
};
