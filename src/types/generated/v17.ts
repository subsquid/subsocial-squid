import type {Result} from './support'

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

export type Content = Content_None | Content_Raw | Content_IPFS | Content_Hyper

export interface Content_None {
  __kind: 'None'
}

export interface Content_Raw {
  __kind: 'Raw'
  value: Uint8Array
}

export interface Content_IPFS {
  __kind: 'IPFS'
  value: Uint8Array
}

export interface Content_Hyper {
  __kind: 'Hyper'
  value: Uint8Array
}

export interface Comment {
  parentId: (bigint | undefined)
  rootPostId: bigint
}
