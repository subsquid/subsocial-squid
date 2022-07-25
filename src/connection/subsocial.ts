import { ApiPromise } from '@polkadot/api';
import { getSubstrateApi, newFlatSubsocialApi } from '@subsocial/api';
import { ipfsReadOnlyNodeUrl, offchainUrl, chainNode } from '../env';
import { FlatSubsocialApi } from '@subsocial/api/flat-subsocial';

let subsocial: FlatSubsocialApi;

const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl
};

export const resolveSubsocialApi = async (): Promise<FlatSubsocialApi> => {
  // Connect to Subsocial's Substrate node:

  if (subsocial) return subsocial;

  const api: ApiPromise = await getSubstrateApi(chainNode);

  if (!api) throw Error('API connection is failed');

  // registry.setChainProperties(properties);
  subsocial = await newFlatSubsocialApi({
    substrateNodeUrl: chainNode,
    ...ipfsConfig
  });

  return subsocial;
};
