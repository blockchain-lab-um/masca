export type Network = {
  name: string;
  isTestnet?: boolean;
  logo: string;
  backgroundColor: string;
};

export const NETWORKS: Record<string, Network> = {
  '0x1': {
    name: 'Ethereum',
    logo: '/images/ethereum_logo.svg',
    backgroundColor: '#6B8AFF33',
  },
  '0xaa36a7': {
    name: 'Sepolia',
    isTestnet: true,
    logo: '/images/ethereum_logo.svg',
    backgroundColor: '#6B8AFF33',
  },
  '0x89': {
    name: 'Polygon',
    logo: '/images/polygon_matic_logo.svg',
    backgroundColor: '#9558FF33',
  },
  '0x13881': {
    name: 'Mumbai',
    isTestnet: true,
    logo: '/images/polygon_matic_logo.svg',
    backgroundColor: '#9558FF33',
  },
};

export const NETWORKS_BY_DID: Record<string, string[]> = {
  'did:ethr': ['*'],
  'did:pkh': ['0x1', '0x89'],
  'did:ens': ['0x1'],
  'did:polygonid': ['0x1', '0x89', '0x13881'],
  'did:iden3': ['0x1', '0x89', '0x13881'],
};

export function getAvailableNetworksList(method: string): Network[] {
  if (NETWORKS_BY_DID[method].includes('*')) {
    return Object.values(NETWORKS);
  }
  return NETWORKS_BY_DID[method].map((network) => NETWORKS[network]);
}
