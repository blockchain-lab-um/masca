import { availableVCStores } from '@blockchain-lab-um/ssi-snap-types/constants';

export function getAvailableVCStores(): string[] {
  return availableVCStores.map((key: string) => key);
}
