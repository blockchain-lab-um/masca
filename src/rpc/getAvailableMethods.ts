import { availableMethods } from '../did/didMethods';

export function getAvailableMethods(): string[] {
  const methods = availableMethods.map((key) => key);
  return methods as string[];
}
