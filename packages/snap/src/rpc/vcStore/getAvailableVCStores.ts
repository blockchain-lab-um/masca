import { availableVCStores } from '../../constants/index';

export function getAvailableVCStores(): string[] {
  return availableVCStores.map((key) => key);
}
