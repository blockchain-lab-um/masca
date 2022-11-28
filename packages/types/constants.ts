export const availableVCStores = ['snap', 'ceramic'];
export type AvailableVCStores = typeof availableVCStores[number];
export const isAvailableVCStores = (x: string): x is AvailableVCStores =>
  availableVCStores.includes(x);

export const availableMethods = ['did:ethr', 'did:key'];
export type AvailableMethods = typeof availableMethods[number];
export const isAvailableMethods = (x: string): x is AvailableMethods =>
  availableMethods.includes(x);

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
];

export type SupportedProofFormats =
  | 'jwt'
  | 'lds'
  | 'EthereumEip712Signature2021';

export const isSupportedProofFormat = (x: string): x is SupportedProofFormats =>
  supportedProofFormats.includes(x);
