import { availableVCStores } from '@blockchain-lab-um/ssi-snap-types';

export function getAvailableVCStores(): string[] {
  return availableVCStores.map((key) => key);
}
