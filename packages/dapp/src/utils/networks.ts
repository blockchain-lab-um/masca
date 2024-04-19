export const NETWORKS: Record<string, string> = {
  '0x1': 'Ethereum',
  '0xaa36a7': 'Sepolia',
  '0x89': 'Polygon',
  '0x13882': 'Polygon Amoy',
};

export const NETWORKS_BY_DID: Record<string, string[]> = {
  'did:ethr': ['*'],
  'did:pkh': ['0x1', '0x89'],
  'did:ens': ['0x1'],
  'did:polygonid': ['0x89', '0x13882'],
  'did:iden3': ['0x89', '0x13882'],
};

export function getAvailableNetworksList(method: string): string[] {
  if (NETWORKS_BY_DID[method].includes('*')) {
    return Object.values(NETWORKS);
  }
  return NETWORKS_BY_DID[method].map((network) => NETWORKS[network]);
}
