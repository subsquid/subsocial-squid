import { IpfsCommonContent } from '@subsocial/api/types/ipfs';
import axios from 'axios';
import * as envConfig from '../env';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { CID_KIND, IpfsCid, Headers } from './types';
import { asIpfsCid } from './utils';
import { Ctx } from '../processor';

export class IpfsDataManager {
  private static instance: IpfsDataManager;

  private ipfsClient!: IPFSHTTPClient;

  private ipfsReadOnlyNodeUrl: string = envConfig.ipfsReadOnlyNodeUrl;

  public fetchedCidsList: Set<string> = new Set();

  constructor(private processorContext: Ctx) {
    this.createIpfsClient();
  }

  static getInstance(ctx: Ctx): IpfsDataManager {
    if (!IpfsDataManager.instance) {
      IpfsDataManager.instance = new IpfsDataManager(ctx);
    }
    return IpfsDataManager.instance;
  }

  private createIpfsClient(headers?: Headers) {
    this.ipfsClient = create({
      url: this.ipfsReadOnlyNodeUrl + '/api/v0',
      headers
    });
  }

  async fetchOneByIdHttp(ipfsCid: IpfsCid): Promise<IpfsCommonContent | null> {
    let res = null;

    if (this.fetchedCidsList.has(ipfsCid.toString())) {
      this.processorContext.log
        .child('ipfs')
        .warn(
          `CID ${ipfsCid.toString()} has been already fetched. No duplicated fetches.`
        );
      return res;
    }

    try {
      res = await this.fetchContent(ipfsCid, 10000);
      this.processorContext.log
        .child('ipfs')
        .info(`Response by CID - ${ipfsCid.toString()} => SUCCESSFUL`);
      this.fetchedCidsList.add(ipfsCid.toString());
      await new Promise((res) => setTimeout(res, 50));
    } catch (e) {
      this.processorContext.log
        .child('ipfs')
        .info(`Response by CID - ${ipfsCid.toString()} => with ERROR`);
      console.log(e);
    }
    // @ts-ignore
    return res;
  }

  private async fetchContent(cid: IpfsCid, timeout?: number) {
    const cidEnsured = asIpfsCid(cid);

    if (!cidEnsured) return null;

    const isCbor = cidEnsured.code === CID_KIND.CBOR;

    if (isCbor) {
      const res = await this.ipfsClient.dag.get(cidEnsured, { timeout });
      return res.value;
    } else {
      const res = await axios.get(
        `${
          this.ipfsReadOnlyNodeUrl
        }/ipfs/${cidEnsured.toV1()}?timeout=${timeout}`,
        {
          responseType: 'arraybuffer'
        }
      );

      const data = new Uint8Array(res.data);
      return JSON.parse(String.fromCharCode(...data));
    }
  }
}
