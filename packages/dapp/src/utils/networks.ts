export type Network = {
  name: string;
  logo: string;
};

export const NETWORKS: Record<string, Network> = {
  '0x1': {
    name: 'Ethereum',
    logo: '/images/ethereum_logo.svg',
  },
  '0xaa36a7': {
    name: 'Sepolia',
    logo: '/images/ethereum_logo.svg',
  },
  '0x89': {
    name: 'Polygon',
    logo: '/images/polygon_matic_logo.svg',
  },
  '0x13881': {
    name: 'Polygon Mumbai',
    logo: '/images/polygon_matic_logo.svg',
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
