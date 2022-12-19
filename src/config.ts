import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env.local` });

export default {
  ipfsReadOnlyNodeUrl:
    process.env.IPFS_READ_ONLY_NODE_URL || 'https://ipfs.subsocial.network',
  chainNode: process.env.CHAIN_NODE || 'wss://para.f3joule.space',
  indexerEndpointUrl:
    process.env.INDEXER_ENDPOINT_URL ||
    'https://subsocial-v1-3-3.archive.subsquid.io/graphql',
  offchainUrl:
    process.env.OFFCHAIN_URL ||
    'https://app.subsocial.network/network/offchain',
  elasticSearchEndpoint: process.env.ELASTIC_SEARCH_ENDPOINT || '',
  elasticSearchUsername: process.env.ELASTIC_SEARCH_USERNAME || '',
  elasticSearchPassword: process.env.ELASTIC_SEARCH_PASSWORD || ''
};
