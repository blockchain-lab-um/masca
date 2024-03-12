import { EthConnectionConfig } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';

export const RHS_URL = 'https://rhs-staging.polygonid.me';

export const POLYGON_MAINNET_RPC_URL = 'https://polygon.llamarpc.com';
export const POLYGON_MUMBAI_RPC_URL =
  'https://polygon-mumbai.blockpi.network/v1/rpc/public';

export const ETH_MAINNET_RPC_URL = 'https://eth.llamarpc.com';

export const CONTRACT_POLYGON_MAINNET =
  '0x624ce98D2d27b20b8f8d521723Df8fC4db71D79D';

export const CONTRACT_POLYGON_MUMBAI =
  '0x134B1BE34911E39A8397ec6289782989729807a4';

export const getDefaultEthConnectionConfig = (
  blockchain: (typeof BLOCKCHAINS)[number],
  networkId: (typeof NETWORKS)[number]
): EthConnectionConfig => {
  let url = null;
  let contractAddress = '';

  if (blockchain === Blockchain.Polygon) {
    if (networkId === NetworkId.Main) {
      url = POLYGON_MAINNET_RPC_URL;
      contractAddress = CONTRACT_POLYGON_MAINNET;
    } else if (networkId === NetworkId.Mumbai) {
      url = POLYGON_MUMBAI_RPC_URL;
      contractAddress = CONTRACT_POLYGON_MUMBAI;
    }
  } else if (blockchain === Blockchain.Ethereum) {
    if (networkId === NetworkId.Main) {
      url = ETH_MAINNET_RPC_URL;
    }
  }

  if (!url) {
    throw new Error('ChainId not supported');
  }

  return {
    url,
    defaultGasLimit: 600000,
    minGasPrice: '0',
    maxGasPrice: '100000000000',
    confirmationBlockCount: 5,
    confirmationTimeout: 600000,
    contractAddress,
    receiptTimeout: 600000,
    rpcResponseTimeout: 5000,
    waitReceiptCycleTime: 30000,
    waitBlockCycleTime: 3000,
    chainId: 80001,
  };
};

export const METHODS = [DidMethod.PolygonId, DidMethod.Iden3] as const;
export const BLOCKCHAINS = [Blockchain.Polygon, Blockchain.Ethereum] as const;
export const NETWORKS = [NetworkId.Mumbai, NetworkId.Main] as const;

export const CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID = {
  '0x1': {
    blockchain: Blockchain.Ethereum,
    networkId: NetworkId.Main,
  },
  '0x89': {
    blockchain: Blockchain.Polygon,
    networkId: NetworkId.Main,
  },
  '0x13881': {
    blockchain: Blockchain.Polygon,
    networkId: NetworkId.Mumbai,
  },
} as Record<
  string,
  {
    blockchain: (typeof BLOCKCHAINS)[number];
    networkId: (typeof NETWORKS)[number];
  }
>;
