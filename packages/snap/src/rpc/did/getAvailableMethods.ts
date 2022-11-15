import { availableMethods } from '../../constants/index';

export function getAvailableMethods(): string[] {
  return availableMethods.map((key: string) => key);
}
