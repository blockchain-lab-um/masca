import { isIn } from '@blockchain-lab-um/utils';

export const availableVCStores = ['snap', 'ceramic'] as const;
export type AvailableVCStores = (typeof availableVCStores)[number];

export const isAvailableVCStores = (x: string) =>
  isIn<AvailableVCStores>(availableVCStores, x);

export const externalSigMethods = ['did:ethr', 'did:pkh'] as const;
export type ExternalSigMethods = (typeof externalSigMethods)[number];

export const internalSigMethods = [
  'did:key',
  'did:key:jwk_jcs-pub',
  'did:jwk',
  // 'did:ebsi',
] as const;
export type InternalSigMethods = (typeof internalSigMethods)[number];

export const availableMethods = [
  ...externalSigMethods,
  ...internalSigMethods,
] as const;

export type AvailableMethods = (typeof availableMethods)[number];
export const isAvailableMethods = (x: string) =>
  isIn<AvailableMethods>(availableMethods, x);
export type MethodsRequiringNetwork = (typeof externalSigMethods)[number];
export const requiresNetwork = (x: string) =>
  isIn<MethodsRequiringNetwork>(externalSigMethods, x);

/**
 * @description
 * Supported networks for selected methods, '*' means all networks
 * Explore networks here: https://chainlist.org/
 */
export const didMethodChainIdMapping: Record<
  MethodsRequiringNetwork,
  readonly string[]
> = {
  'did:ethr': ['*'],
  'did:pkh': ['0x1', '0x89'],
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
export const methodIndexMapping: Record<InternalSigMethods, number> = {
  'did:key': 0,
  'did:key:jwk_jcs-pub': 0,
  'did:jwk': 1,
} as const;

export const supportedProofFormats = [
  'jwt',
  'lds',
  'EthereumEip712Signature2021',
] as const;

export type SupportedProofFormats = (typeof supportedProofFormats)[number];

export const isSupportedProofFormat = (x: string) =>
  isIn<SupportedProofFormats>(supportedProofFormats, x);
