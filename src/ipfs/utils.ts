import { IpfsCid } from "./types";
import { CID } from "ipfs-http-client";

export const isEmptyArray = <T>(x: any | T[]): boolean =>
  !Array.isArray(x) || (Array.isArray(x) && x.length === 0);

export const asIpfsCid = (cid: IpfsCid): CID | undefined => {
  if (!cid) return undefined;

  if (cid instanceof CID) {
    return cid;
  } else if (typeof cid === 'string') {
    return CID.parse(cid);
  } else if (typeof cid?.toU8a === 'function') {
    return CID.parse(cid.toString());
  } else {
    throw new Error(
      'Wrong type of IPFS CID. Valid types are: string | CID | IpfsCid'
    );
  }
};

const getUniqueCids = (cids: IpfsCid[]) => {
  const ipfsCids = getUniqueIds(cids.map(asIpfsCid));

  if (isEmptyArray(ipfsCids)) {
    return [];
  }

  return ipfsCids;
};

export const getUniqueIds = <ID extends IpfsCid>(
  ids: (ID | undefined)[]
): ID[] => {
  if (isEmptyArray(ids)) return [];

  const knownIds = new Set<string>();
  const uniqueIds: ID[] = [];

  ids.forEach((id) => {
    if (typeof id?.toString === 'function') {
      const idStr = id.toString();
      if (!knownIds.has(idStr)) {
        knownIds.add(idStr);
        uniqueIds.push(id);
      }
    }
  });

  return uniqueIds;
};