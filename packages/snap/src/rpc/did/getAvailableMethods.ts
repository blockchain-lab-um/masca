import { availableMethods } from '../../did/didMethods';

export function getAvailableMethods(): string[] {
  return availableMethods.map((key) => key);
}
