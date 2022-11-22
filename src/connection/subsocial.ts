import { SubsocialApi } from '@subsocial/api';
import { ipfsReadOnlyNodeUrl, offchainUrl, chainNode } from '../env';

let subsocial: SubsocialApi;

const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl
};

export const resolveSubsocialApi = async (): Promise<SubsocialApi> => {
  // Connect to Subsocial's Substrate node:

  if (subsocial) return subsocial;
  subsocial = await SubsocialApi.create({
    substrateNodeUrl: chainNode,
    ...ipfsConfig
  });

  // await subsocial.ipfs.getContentArray('99s3msd32cs');

  return subsocial;
};