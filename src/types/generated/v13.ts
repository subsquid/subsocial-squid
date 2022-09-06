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

export interface Comment {
  rootPostId: bigint
  parentId: (bigint | undefined)
}
