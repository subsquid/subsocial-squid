import type {Result} from './support'

export type ReactionKind = ReactionKind_Upvote | ReactionKind_Downvote

export interface ReactionKind_Upvote {
  __kind: 'Upvote'
}

export interface ReactionKind_Downvote {
  __kind: 'Downvote'
}

export type PostExtension = PostExtension_RegularPost | PostExtension_Comment | PostExtension_SharedPost

export interface PostExtension_RegularPost {
  __kind: 'RegularPost'
}

export interface PostExtension_Comment {
  __kind: 'Comment'
  value: Comment
}

export interface PostExtension_SharedPost {
  __kind: 'SharedPost'
  value: bigint
}

export type Content = Content_None | Content_Other | Content_IPFS

export interface Content_None {
  __kind: 'None'
}

export interface Content_Other {
  __kind: 'Other'
  value: Uint8Array
}

export interface Content_IPFS {
  __kind: 'IPFS'
  value: Uint8Array
}

export interface Post {
  id: bigint
  created: WhoAndWhen
  edited: boolean
  owner: Uint8Array
  extension: PostExtension
  spaceId: (bigint | undefined)
  content: Content
  hidden: boolean
  upvotesCount: number
  downvotesCount: number
}

export interface Space {
  id: bigint
  created: WhoAndWhen
  edited: boolean
  owner: Uint8Array
  content: Content
  hidden: boolean
  permissions: (SpacePermissions | undefined)
}

export interface Comment {
  rootPostId: bigint
  parentId: (bigint | undefined)
}

export interface WhoAndWhen {
  account: Uint8Array
  block: number
  time: bigint
}

export interface SpacePermissions {
  none: (SpacePermission[] | undefined)
  everyone: (SpacePermission[] | undefined)
  follower: (SpacePermission[] | undefined)
  spaceOwner: (SpacePermission[] | undefined)
}

export type SpacePermission = SpacePermission_ManageRoles | SpacePermission_RepresentSpaceInternally | SpacePermission_RepresentSpaceExternally | SpacePermission_UpdateSpace | SpacePermission_CreateSubspaces | SpacePermission_UpdateOwnSubspaces | SpacePermission_DeleteOwnSubspaces | SpacePermission_HideOwnSubspaces | SpacePermission_UpdateAnySubspace | SpacePermission_DeleteAnySubspace | SpacePermission_HideAnySubspace | SpacePermission_CreatePosts | SpacePermission_UpdateOwnPosts | SpacePermission_DeleteOwnPosts | SpacePermission_HideOwnPosts | SpacePermission_UpdateAnyPost | SpacePermission_DeleteAnyPost | SpacePermission_HideAnyPost | SpacePermission_CreateComments | SpacePermission_UpdateOwnComments | SpacePermission_DeleteOwnComments | SpacePermission_HideOwnComments | SpacePermission_HideAnyComment | SpacePermission_Upvote | SpacePermission_Downvote | SpacePermission_Share | SpacePermission_OverrideSubspacePermissions | SpacePermission_OverridePostPermissions | SpacePermission_SuggestEntityStatus | SpacePermission_UpdateEntityStatus | SpacePermission_UpdateSpaceSettings

export interface SpacePermission_ManageRoles {
  __kind: 'ManageRoles'
}

export interface SpacePermission_RepresentSpaceInternally {
  __kind: 'RepresentSpaceInternally'
}

export interface SpacePermission_RepresentSpaceExternally {
  __kind: 'RepresentSpaceExternally'
}

export interface SpacePermission_UpdateSpace {
  __kind: 'UpdateSpace'
}

export interface SpacePermission_CreateSubspaces {
  __kind: 'CreateSubspaces'
}

export interface SpacePermission_UpdateOwnSubspaces {
  __kind: 'UpdateOwnSubspaces'
}

export interface SpacePermission_DeleteOwnSubspaces {
  __kind: 'DeleteOwnSubspaces'
}

export interface SpacePermission_HideOwnSubspaces {
  __kind: 'HideOwnSubspaces'
}

export interface SpacePermission_UpdateAnySubspace {
  __kind: 'UpdateAnySubspace'
}

export interface SpacePermission_DeleteAnySubspace {
  __kind: 'DeleteAnySubspace'
}

export interface SpacePermission_HideAnySubspace {
  __kind: 'HideAnySubspace'
}

export interface SpacePermission_CreatePosts {
  __kind: 'CreatePosts'
}

export interface SpacePermission_UpdateOwnPosts {
  __kind: 'UpdateOwnPosts'
}

export interface SpacePermission_DeleteOwnPosts {
  __kind: 'DeleteOwnPosts'
}

export interface SpacePermission_HideOwnPosts {
  __kind: 'HideOwnPosts'
}

export interface SpacePermission_UpdateAnyPost {
  __kind: 'UpdateAnyPost'
}

export interface SpacePermission_DeleteAnyPost {
  __kind: 'DeleteAnyPost'
}

export interface SpacePermission_HideAnyPost {
  __kind: 'HideAnyPost'
}

export interface SpacePermission_CreateComments {
  __kind: 'CreateComments'
}

export interface SpacePermission_UpdateOwnComments {
  __kind: 'UpdateOwnComments'
}

export interface SpacePermission_DeleteOwnComments {
  __kind: 'DeleteOwnComments'
}

export interface SpacePermission_HideOwnComments {
  __kind: 'HideOwnComments'
}

export interface SpacePermission_HideAnyComment {
  __kind: 'HideAnyComment'
}

export interface SpacePermission_Upvote {
  __kind: 'Upvote'
}

export interface SpacePermission_Downvote {
  __kind: 'Downvote'
}

export interface SpacePermission_Share {
  __kind: 'Share'
}

export interface SpacePermission_OverrideSubspacePermissions {
  __kind: 'OverrideSubspacePermissions'
}

export interface SpacePermission_OverridePostPermissions {
  __kind: 'OverridePostPermissions'
}

export interface SpacePermission_SuggestEntityStatus {
  __kind: 'SuggestEntityStatus'
}

export interface SpacePermission_UpdateEntityStatus {
  __kind: 'UpdateEntityStatus'
}

export interface SpacePermission_UpdateSpaceSettings {
  __kind: 'UpdateSpaceSettings'
}
