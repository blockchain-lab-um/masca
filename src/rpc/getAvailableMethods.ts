import { availableMethods } from "../did/did-methods";

export function getAvailableMethods(): string[] {
  const methods = availableMethods.map((key) => key);
  return methods as string[];
}
