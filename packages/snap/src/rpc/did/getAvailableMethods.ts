import { availableMethods } from '@blockchain-lab-um/ssi-snap-types/constants';

export function getAvailableMethods(): string[] {
  return availableMethods.map((key: string) => key);
}
