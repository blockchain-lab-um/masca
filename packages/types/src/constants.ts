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

export const didCoinTypeMappping: Record<string, number> = {
  'did:ethr': 60,
  'did:key': 60,
  'did:pkh': 60,
  // 'did:ebsi': 60,
  'did:key:ebsi': 60,
  'did:jwk': 60,
};

export const supportedProofFormats = [
  'jwt',
  'lds',
  'EthereumEip712Signature2021',
] as const;

export type SupportedProofFormats = (typeof supportedProofFormats)[number];

export const isSupportedProofFormat = (x: string) =>
  isIn<SupportedProofFormats>(supportedProofFormats, x);
