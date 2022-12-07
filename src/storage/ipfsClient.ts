import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { CID } from 'multiformats/cid';
import * as envConfig from '../env';
import { IpfsCid, IpfsCommonContent } from "@subsocial/api/types/ipfs";
import { ContentResult } from '@subsocial/api/types';
import * as dagCBOR from '@ipld/dag-cbor';

enum CID_KIND {
  CBOR = 113,
  UNIXFS = 112
}

let ipfsClientInstance: IPFSHTTPClient | null = null;

export function getIpfsClient(): IPFSHTTPClient {
  if (ipfsClientInstance) return ipfsClientInstance;
  ipfsClientInstance = create({
    url: envConfig.ipfsReadOnlyNodeUrl + '/api/v0'
  });

  return ipfsClientInstance;
}

export async function getMany<T extends IpfsCommonContent>(
  ipfsCids: IpfsCid[]
): Promise<ContentResult<T>> {
  const client = getIpfsClient();
  // const cidItem = CID.parse('svdfv');
  // cidItem.toV1()
  // const resp = client.get(`/ipfs/${cid.toV1()}`);
  // const resp = client.dag.get(cidItem)

  try {
    const content: ContentResult<T> = {};

    const promisesList = ipfsCids.map(async (cid) => {
      const cidStr = cid.toString();
      const cidItem = CID.parse(cidStr);
      // const isCbor = cidItem.code === CID_KIND.CBOR;
      const respIterator = client.get(`/ipfs/${cidItem.toV1()}`);

      let itemContent = new Uint8Array();
      for await (const data of respIterator) {
        console.dir(data, { depth: null });
        // itemContent = dagCBOR.decode(data);
      }
      console.log('-----------------------------');

      // const data = new Uint8Array(resp.data);
      // content[cidStr] = itemContent;

      // const data = new Uint8Array(res.data);
      // const cidStr = cid.toString();
      //
      // if (isCbor) {
      //   content[cidStr] = dagCBOR.decode(data);
      // }
      //
      // if (cid.code == CID_KIND.UNIXFS) {
      //   content[cidStr] = JSON.parse(String.fromCharCode(...data));
      // }
    });

    await Promise.all(promisesList);
    return content;
  } catch (err) {
    console.log('ERROR - ', err);
    return {};
  }
}
