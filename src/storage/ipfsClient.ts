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
import { setPriority } from 'os';
import { resolveSubsocialApi } from '../connection/subsocial';
// import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

let ipfsNode: IPFSTypes.IPFS | null = null;

export async function getIpfsNode(): Promise<IPFSTypes.IPFS> {
  if (ipfsNode) return ipfsNode;
  // @ts-ignore
  ipfsNode = await IPFS.create();

  // @ts-ignore
  return ipfsNode;
}

export class IpfsDataManager {
  private static instance: IpfsDataManager;

  private ipfsNode: IPFSTypes.IPFS | null = null;

  public contentMap: Map<string, CommonContent> = new Map();

  public fetchedCidsList: Set<string> = new Set();

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

  async fetchOneByIdHttp(ipfsCid: IpfsCid): Promise<IpfsCommonContent | null> {
    const subsocialApi = await resolveSubsocialApi();
    let res = null;

    if (this.fetchedCidsList.has(ipfsCid.toString())) {
      console.log(
        `CID ${ipfsCid.toString()} has been already fetched. No duplicated fetches.`
      );
      return res;
    }

    try {
      console.log(`Request by CID - ${ipfsCid.toString()}`);
      res = await subsocialApi.ipfs.getContent(ipfsCid, 10000);
      console.log(`Response by CID - ${ipfsCid.toString()} >>>`);
      this.fetchedCidsList.add(ipfsCid.toString());
      await new Promise((res) => setTimeout(res, 200));
    } catch (e) {
      console.log(`Response by CID - ${ipfsCid.toString()} with ERROR`);
      console.log(e);
    }
    // @ts-ignore
    return res;
  }

  async fetchOneById(ipfsCid: IpfsCid): Promise<IpfsCommonContent> {
    // const node = await this.getIpfsNode();
    const node = await IPFS.create();
    const cidStr = ipfsCid.toString();
    let res = null;

    try {
      console.log(`Request by CID - ${cidStr}`);
      for await (const chunk of node.cat(cidStr, {
        timeout: 10000
      })) {
        res = chunk;

        console.log(`Response by CID - ${cidStr} >>>`);
      }
      await new Promise((res) => setTimeout(res, 100));
    } catch (e) {
      console.log(`Response by CID - ${cidStr} with ERROR`);
      console.log(e);
    }
    await node.stop();
    // @ts-ignore
    return res;
  }

  async fetchManyByCids<T extends IpfsCommonContent>(
    ipfsCids: IpfsCid[]
  ): Promise<void> {
    const maxCallsPerNode = 5;
    let nodeUsageIndex = 0;
    // const node = await this.getIpfsNode();
    let node = await IPFS.create();
    console.log('fetchManyByCids - ', ipfsCids.length);

    for (const cidItem of ipfsCids) {
      if (nodeUsageIndex > maxCallsPerNode) {
        nodeUsageIndex = 0;
        await node.stop();
        node = await IPFS.create();
        console.log('node recreate ::::::::');
      }
      const cidStr = cidItem.toString();
      console.log(`Request by CID - ${cidStr}`);
      try {
        for await (const chunk of node.cat(cidStr, {
          timeout: 20000
        })) {
          // @ts-ignore
          this.contentMap.set(
            cidStr,
            // @ts-ignore
            chunk
          );
          console.log(`Response by CID - ${cidStr} >>>`);
          // console.dir(this.contentMap.get(cidStr), { depth: null });
        }
        await new Promise((res) => setTimeout(res, 50));
      } catch (e) {
        console.log(`Response by CID - ${cidStr} with ERROR`);
        console.log(e);
      }
      nodeUsageIndex++;
    }

    // try {
    //   await batchCaller({
    //     srcList: ipfsCids,
    //     batchSize: 100,
    //     timeout: 10000,
    //     handler: async (cidsBatch) => {
    //       const promisesList = cidsBatch.map(async (cid) => {
    //         const cidStr = cid.toString();
    //
    //         const controller = new AbortController();
    //         const signal = controller.signal;
    //
    //         try {
    //           for await (const chunk of node.cat(cidStr, {
    //             timeout: 10000,
    //             signal
    //           })) {
    //             // @ts-ignore
    //             this.contentMap.set(
    //               cidStr,
    //               // @ts-ignore
    //               chunk
    //             );
    //           }
    //           controller.abort();
    //         } catch (e) {
    //           console.log(e);
    //         }
    //
    //         console.dir(this.contentMap.get(cidStr), { depth: null });
    //       });
    //
    //       await Promise.all(promisesList);
    //       console.log(`icds batch has been resolved`);
    //       // await new Promise((res) => setTimeout(res, 1000));
    //     }
    //   });
    // } catch (err) {
    //   console.log('ERROR - ', err);
    // }
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
