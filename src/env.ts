require('dotenv').config();

export const ipfsReadOnlyNodeUrl =
  process.env.IPFS_READ_ONLY_NODE_URL || 'https://ipfs.subsocial.network';

export const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 10;
export const chainNode = process.env.CHAIN_NODE || 'wss://para.f3joule.space';
export const indexerEndpointUrl =
  process.env.INDEXER_ENDPOINT_URL ||
  'https://subsocial.archive.subsquid.io/graphql';
export const offchainUrl =
  process.env.OFFCHAIN_URL || 'https://app.subsocial.network/network/offchain';
export const warningLogsTrace = process.env.WARNING_LOGS_TRACE || 'false';
export const eventLogsTrace = process.env.EVENT_LOGS_TRACE || 'false';
