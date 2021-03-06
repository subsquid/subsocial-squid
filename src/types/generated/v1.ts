import type {Result} from './support'

export type AccountId = Uint8Array

export type PostId = bigint

export type ReactionId = bigint

export type SpaceId = bigint

export type PostExtension = PostExtension_RegularPost | PostExtension_Comment | PostExtension_SharedPost

export interface PostExtension_RegularPost {
  __kind: 'RegularPost'
  value: null
}

export interface PostExtension_Comment {
  __kind: 'Comment'
  value: Comment
}

export interface PostExtension_SharedPost {
  __kind: 'SharedPost'
  value: PostId
}

export type Content = Content_None | Content_Raw | Content_IPFS | Content_Hyper

export interface Content_None {
  __kind: 'None'
  value: null
}

export interface Content_Raw {
  __kind: 'Raw'
  value: string
}

export interface Content_IPFS {
  __kind: 'IPFS'
  value: string
}

export interface Content_Hyper {
  __kind: 'Hyper'
  value: string
}

export type ReactionKind = ReactionKind_Upvote | ReactionKind_Downvote

export interface ReactionKind_Upvote {
  __kind: 'Upvote'
}

export interface ReactionKind_Downvote {
  __kind: 'Downvote'
}

export interface Comment {
  parentId: (PostId | undefined)
  rootPostId: PostId
}
