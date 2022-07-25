require('dotenv').config();

export const ipfsReadOnlyNodeUrl =
  process.env.IPFS_READ_ONLY_NODE_URL || 'https://app.subsocial.network/ipfs';

export const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 100;
export const chainNode =
  process.env.CHAIN_NODE || 'wss://arch.subsocial.network';
export const indexerEndpointUrl =
  process.env.INDEXER_ENDPOINT_URL ||
  'https://subsocial.archive.subsquid.io/graphql';
export const offchainUrl =
  process.env.OFFCHAIN_URL || 'https://app.subsocial.network/network/offchain';
export const warningLogsTrace = process.env.WARNING_LOGS_TRACE || 'false';
export const eventLogsTrace = process.env.EVENT_LOGS_TRACE || 'false';
