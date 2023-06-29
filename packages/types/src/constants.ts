import { isIn } from '@blockchain-lab-um/utils';

export const availableVCStores = ['snap', 'ceramic'] as const;
export type AvailableVCStores = (typeof availableVCStores)[number];

export const isAvailableVCStores = (x: string) =>
  isIn<AvailableVCStores>(availableVCStores, x);

export const availableMethods = [
  'did:ethr',
  'did:key',
  'did:key:ebsi',
  'did:pkh',
  // 'did:ebsi',
  'did:jwk',
] as const;
export type AvailableMethods = (typeof availableMethods)[number];
export const isAvailableMethods = (x: string) =>
  isIn<AvailableMethods>(availableMethods, x);

export const didCoinTypeMapping: Record<AvailableMethods, number> = {
  'did:ethr': 60,
  'did:key': 60,
  'did:pkh': 60,
  // 'did:ebsi': 60,
  'did:key:ebsi': 60,
  'did:jwk': 60,
} as const;

/**
 * @description
 * Supported networks for each method, '*' means all networks
 * Explore networks here: https://chainlist.org/
 */
export const didMethodChainIdMapping: Record<AvailableMethods, readonly string[]> = {
  'did:ethr': ['*'],
  'did:key': ['*'],
  'did:pkh': ['0x1, 0x89'],
  'did:key:ebsi': ['*'],
  'did:jwk': ['*'],
} as const;

/**
 * @description
 * This mapping is used for entropy based account derivation
 *
 * in the path: m / purpose' / coin_type' / account' / change / address_index, our indices
 * are used as account', later on, address_index will be used for key rotation
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels for more info on BIP44
 */
export const methodIndexMapping: Record<AvailableMethods, number> = {
  'did:key': 0,
  'did:key:ebsi': 0,
  'did:jwk': 1,
  'did:ethr': 3,
  'did:pkh': 3,
} as const;

export const supportedProofFormats = [
  'jwt',
  'lds',
  'EthereumEip712Signature2021',
] as const;

export type SupportedProofFormats = (typeof supportedProofFormats)[number];

export const isSupportedProofFormat = (x: string) =>
  isIn<SupportedProofFormats>(supportedProofFormats, x);
