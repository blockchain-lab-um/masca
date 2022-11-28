import { availableMethods } from '@blockchain-lab-um/ssi-snap-types';

export function getAvailableMethods(): string[] {
  return availableMethods.map((key) => key);
}
