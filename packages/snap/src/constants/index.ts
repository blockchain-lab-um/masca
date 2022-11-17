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
