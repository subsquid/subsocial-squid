import { registry } from '@subsocial/types/substrate/registry';
import { ApiPromise } from '@polkadot/api';
import { getSubstrateApi, newFlatSubsocialApi } from '@subsocial/api';
import { ipfsReadOnlyNodeUrl, offchainUrl, chainNode } from '../env';
import { FlatSubsocialApi } from '@subsocial/api/flat-subsocial';

let subsocial: FlatSubsocialApi;

const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl
};

const subsocialConnectionsAttemptsNum = 5;

const tryConnectApi = async (
  requestFunction: typeof getSubstrateApi,
  triesNumber = subsocialConnectionsAttemptsNum
): Promise<ApiPromise | null> => {
  try {
    console.log(
      `Subsocial API connection attempt - #${
        subsocialConnectionsAttemptsNum - triesNumber + 1
      }`
    );
    return await requestFunction();
  } catch (e) {
    if (triesNumber - 1 >= 0) {
      return await tryConnectApi(requestFunction, triesNumber - 1);
    } else {
      return null;
    }
  }
};

export const resolveSubsocialApi = async (): Promise<FlatSubsocialApi> => {
  // Connect to Subsocial's Substrate node:

  if (subsocial) return subsocial;

  const api: ApiPromise | null = await tryConnectApi(async () =>
    getSubstrateApi(chainNode)
  );
  console.log(111)

  if (!api) throw Error('API connection is failed');

  const properties = await api.rpc.system.properties();

  registry.setChainProperties(properties);
  subsocial = await newFlatSubsocialApi({
    substrateNodeUrl: chainNode,
    ...ipfsConfig
  });
  console.log(222)

  return subsocial;
};
