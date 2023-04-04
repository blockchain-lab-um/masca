import { availableMethods } from '@blockchain-lab-um/masca-types';

export function getAvailableMethods(): string[] {
  return availableMethods.map((key: string) => key);
}
