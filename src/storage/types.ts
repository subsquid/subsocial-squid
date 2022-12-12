import {
  IpfsPostContentSummarized,
  IpfsSpaceContentSummarized,
  PostStorageData,
  SpaceStorageData
} from '../common/types';

export type StorageSection = 'space' | 'post';
export type BlochHash = string;
export type EntityId = string;

export type StorageData<T> = T extends 'space'
  ? SpaceStorageData
  : T extends 'post'
  ? PostStorageData
  : never;

export type IpfsContent<T> = T extends 'space'
  ? IpfsSpaceContentSummarized
  : T extends 'post'
  ? IpfsPostContentSummarized
  : never;
