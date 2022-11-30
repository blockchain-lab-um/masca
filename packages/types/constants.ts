// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isIn = <T>(values: readonly T[], value: any): value is T => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return values.includes(value);
};

export const availableVCStores = ['snap', 'ceramic'] as const;
export type AvailableVCStores = typeof availableVCStores[number];

export const isAvailableVCStores = (x: string) => isIn(availableVCStores, x);

export const availableMethods = ['did:ethr', 'did:key'] as const;
export type AvailableMethods = typeof availableMethods[number];
export const isAvailableMethods = (x: string) => isIn(availableMethods, x);

export const didCoinTypeMappping: Record<string, number> = {
  'did:ethr': 60,
  'did:key': 60,
};

// Source: https://github.com/multiformats/multicodec/blob/master/table.csv
export type CodecName =
  | 'secp256k1-priv'
  | 'secp256k1-pub'
  | 'ed25519-priv'
  | 'ed25519-pub';

export const MULTICODECS: Record<CodecName, Uint8Array> = {
  'secp256k1-priv': new Uint8Array([129, 38]),
  'secp256k1-pub': new Uint8Array([231, 1]),
  'ed25519-priv': new Uint8Array([128, 38]),
  'ed25519-pub': new Uint8Array([237, 1]),
};

export const supportedProofFormats = [
  'jwt',
  'lds',
  'EthereumEip712Signature2021',
] as const;

export type SupportedProofFormats = typeof supportedProofFormats[number];

export const isSupportedProofFormat = (x: string) =>
  isIn(supportedProofFormats, x);
