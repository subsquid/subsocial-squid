require('dotenv').config();

export const ipfsReadOnlyNodeUrl =
  process.env.IPFS_READ_ONLY_NODE_URL || 'https://app.subsocial.network/ipfs';

export const dbName = process.env.DB_NAME || 'subsocial';
export const dbUser = process.env.DB_USER || 'dev';
export const dbPass = process.env.DB_PASS || 'qweasdzxc1';
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbPort = parseInt(process.env.DB_PORT || '') || 5432;
export const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 500;
export const chainNode =
  process.env.CHAIN_NODE || 'wss://arch.subsocial.network';
export const indexerEndpointUrl =
  process.env.INDEXER_ENDPOINT_URL ||
  'https://subsocial.archive.subsquid.io/graphql';
export const offchainUrl =
  process.env.OFFCHAIN_URL || 'https://app.subsocial.network/network/offchain';
export const warningLogsTrace = process.env.WARNING_LOGS_TRACE || 'true';
export const eventLogsTrace = process.env.EVENT_LOGS_TRACE || 'false';
