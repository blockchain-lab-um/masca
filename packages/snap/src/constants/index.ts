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
