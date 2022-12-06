import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { CID } from 'multiformats/cid'
import * as envConfig from '../env';
//
// let ipfsClientInstance: IPFSHTTPClient | null = null;
//
// export function getIpfsClient(): IPFSHTTPClient {
//   if (ipfsClientInstance) return ipfsClientInstance;
//   ipfsClientInstance = create({ url: envConfig.ipfsReadOnlyNodeUrl });
//
//   return ipfsClientInstance;
// }
//
// export async function getMany(cids: string[]) {
//   const client = getIpfsClient()
//   const cidItem = CID.parse('svdfv');
//
//   // const resp = client.get(`${this._ipfsNodeUrl}/ipfs/${cid.toV1()}?timeout=5000ms${isCbor ? '&format=raw' : ''}`)
//   const resp = client.dag.get(cidItem)
// }
