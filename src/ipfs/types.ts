import { CID } from "ipfs-http-client";
import { Text } from "@polkadot/types-codec";

export enum CID_KIND {
  CBOR = 113,
  UNIXFS = 112
}

export type IpfsCid = string | CID | Text;

export type Headers = Record<string, any>;
