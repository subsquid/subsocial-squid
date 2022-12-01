import { Content } from '../types/generated/v13';
import { ContentSrcDecorated, SpacePermissionsScope } from './types';
import { SpacePermissionMap } from '@subsocial/api/types/dto';
import * as v13 from '../types/generated/v13';
import { ReactionKind } from '../model';

export function getContentSrcDecorated(
  contentSrc: Content | undefined
): ContentSrcDecorated {
  const res: ContentSrcDecorated = {
    ipfsSrc: null,
    otherSrc: null,
    none: false
  };

  if (!contentSrc) return { ...res, none: true };

  switch (contentSrc.__kind) {
    case 'IPFS':
      res.ipfsSrc = contentSrc.value.toString();
      break;
    case 'Other':
      res.otherSrc = contentSrc.value.toString();
      break;
    default:
      res.none = true;
  }

  return res;
}

function getSpacePermissionsTpl(): Required<SpacePermissionMap> {
  return {
    ManageRoles: false,
    RepresentSpaceInternally: false,
    RepresentSpaceExternally: false,
    UpdateSpace: false,
    CreateSubspaces: false,
    UpdateOwnSubspaces: false,
    DeleteOwnSubspaces: false,
    HideOwnSubspaces: false,
    UpdateAnySubspace: false,
    DeleteAnySubspace: false,
    HideAnySubspace: false,
    CreatePosts: false,
    UpdateOwnPosts: false,
    DeleteOwnPosts: false,
    HideOwnPosts: false,
    UpdateAnyPost: false,
    DeleteAnyPost: false,
    HideAnyPost: false,
    CreateComments: false,
    UpdateOwnComments: false,
    DeleteOwnComments: false,
    HideOwnComments: false,
    HideAnyComment: false,
    Upvote: false,
    Downvote: false,
    Share: false,
    OverrideSubspacePermissions: false,
    OverridePostPermissions: false,
    SuggestEntityStatus: false,
    UpdateEntityStatus: false,
    UpdateSpaceSettings: false
  };
}

export function getSpacePermissionsDecorated(
  permissionsSrc: v13.SpacePermissions | undefined = {
    none: undefined,
    everyone: undefined,
    follower: undefined,
    spaceOwner: undefined
  }
): SpacePermissionsScope {
  const res: SpacePermissionsScope = {
    none: getSpacePermissionsTpl(),
    everyone: getSpacePermissionsTpl(),
    follower: getSpacePermissionsTpl(),
    spaceOwner: getSpacePermissionsTpl()
  };

  for (const permSection in permissionsSrc) {
    if (!permissionsSrc[permSection as keyof v13.SpacePermissions]) continue;
    for (const srcPermItem of permissionsSrc[
      permSection as keyof v13.SpacePermissions
    ]!) {
      res[permSection as keyof SpacePermissionsScope][srcPermItem.__kind] =
        true;
    }
  }

  return res;
}

export function getReactionKindDecorated(
  kindSrc: v13.ReactionKind
): ReactionKind {
  return ReactionKind[kindSrc.__kind];
}
