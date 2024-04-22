import type { EthConnectionConfig } from '@0xpolygonid/js-sdk';
import {
  Blockchain,
  DidMethod,
  NetworkId,
} from '@blockchain-lab-um/masca-types';

export const RHS_URL = 'https://rhs-staging.polygonid.me';

export const POLYGON_MAINNET_RPC_URL = 'https://polygon.llamarpc.com';
export const POLYGON_AMOY_RPC_URL =
  'https://polygon-amoy.blockpi.network/v1/rpc/public';

export const CONTRACT_POLYGON_MAINNET =
  '0x624ce98D2d27b20b8f8d521723Df8fC4db71D79D';

export const CONTRACT_POLYGON_AMOY =
  '0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124';

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
    } else if (networkId === NetworkId.Amoy) {
      url = POLYGON_AMOY_RPC_URL;
      contractAddress = CONTRACT_POLYGON_AMOY;
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
export const BLOCKCHAINS = [Blockchain.Polygon] as const;
export const NETWORKS = [NetworkId.Amoy, NetworkId.Main] as const;

export const CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID = {
  '0x89': {
    blockchain: Blockchain.Polygon,
    networkId: NetworkId.Main,
  },
  '0x13882': {
    blockchain: Blockchain.Polygon,
    networkId: NetworkId.Amoy,
  },
} as Record<
  string,
  {
    blockchain: (typeof BLOCKCHAINS)[number];
    networkId: (typeof NETWORKS)[number];
  }
>;
