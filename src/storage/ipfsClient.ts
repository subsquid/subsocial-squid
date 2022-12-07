import { create, IPFSHTTPClient, CID } from 'ipfs-http-client';
// import { CID } from 'multiformats';
import * as envConfig from '../env';
import { IpfsCid, IpfsCommonContent } from '@subsocial/api/types/ipfs';
import { CommonContent, ContentResult } from '@subsocial/api/types';
import IPFSTypes from 'ipfs-core-types';
import * as IPFS from 'ipfs-core';
import { decode } from '@ipld/dag-cbor';
import { Ctx } from '../processor';
import { batchCaller } from '../common/utils';

let ipfsNode: IPFSTypes.IPFS | null = null;

export async function getIpfsNode(): Promise<IPFSTypes.IPFS> {
  if (ipfsNode) return ipfsNode;
  // @ts-ignore
  ipfsNode = await IPFS.create();

  // @ts-ignore
  return ipfsNode;
}

export async function getMany<T extends IpfsCommonContent>(
  ipfsCids: IpfsCid[]
): Promise<ContentResult<T>> {
  const node = await getIpfsNode();

  try {
    const content: ContentResult<T> = {};

    const promisesList = ipfsCids.map(async (cid) => {
      const cidStr = cid.toString();
      const cidItem = CID.parse(cidStr);

      // @ts-ignore
      const nodeResp = await node.get(cidStr);
      // const decoder = new TextDecoder()
      for await (const chunk of node.cat(cidStr)) {
        // @ts-ignore
        content[cidStr] = chunk;
        // streamResult += decoder.decode(chunk, {
        //   stream: true
        // })
      }
    });

    await Promise.all(promisesList);
    return content;
  } catch (err) {
    console.log('ERROR - ', err);
    return {};
  }
}

export class IpfsDataManager {
  private static instance: IpfsDataManager;

  private ipfsNode: IPFSTypes.IPFS | null = null;

  public contentMap: Map<string, CommonContent> = new Map();

  static getInstance(): IpfsDataManager {
    if (!IpfsDataManager.instance) {
      IpfsDataManager.instance = new IpfsDataManager();
    }
    return IpfsDataManager.instance;
  }

  getContent(cid: string) {
    return this.contentMap.get(cid);
  }

  purgeStorage() {
    this.contentMap.clear();
  }

  async getIpfsNode(): Promise<IPFSTypes.IPFS> {
    if (this.ipfsNode) return this.ipfsNode;
    // @ts-ignore
    this.ipfsNode = await IPFS.create();
    if (this.ipfsNode) {
      try {
        await this.ipfsNode.start();
      } catch (e) {
        console.log(e);
      }
    }

    return this.ipfsNode as IPFSTypes.IPFS;
  }

  async fetchManyByCids<T extends IpfsCommonContent>(
    ipfsCids: IpfsCid[]
  ): Promise<void> {
    const node = await this.getIpfsNode();

    console.log('fetchManyByCids - ', ipfsCids.length);

    try {
      await batchCaller({
        srcList: ipfsCids,
        batchSize: 100,
        timeout: 5000,
        handler: async (cidsBatch) => {
          const promisesList = cidsBatch.map(async (cid) => {
            const cidStr = cid.toString();
            for await (const chunk of node.cat(cidStr)) {
              // @ts-ignore
              this.contentMap.set(cidStr, chunk);
            }
          });

          await Promise.all(promisesList);
          await new Promise((res) => setTimeout(res, 1000));
        }
      });
    } catch (err) {
      console.log('ERROR - ', err);
    }
  }

  // async getManyByCids<T extends IpfsCommonContent>(
  //   ipfsCids: IpfsCid[]
  // ): Promise<ContentResult<T>> {
  //   const node = await this.getIpfsNode();
  //
  //   try {
  //     const content: ContentResult<T> = {};
  //
  //     const promisesList = ipfsCids.map(async (cid) => {
  //       const cidStr = cid.toString();
  //       for await (const chunk of node.cat(cidStr)) {
  //         // @ts-ignore
  //         content[cidStr] = chunk;
  //       }
  //     });
  //
  //     await Promise.all(promisesList);
  //     return content;
  //   } catch (err) {
  //     console.log('ERROR - ', err);
  //     return {};
  //   }
  // }
}
