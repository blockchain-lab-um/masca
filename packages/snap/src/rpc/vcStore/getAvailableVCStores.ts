import { availableVCStores } from '@blockchain-lab-um/masca-types';

export function getAvailableVCStores(): string[] {
  return availableVCStores.map((key: string) => key);
}
