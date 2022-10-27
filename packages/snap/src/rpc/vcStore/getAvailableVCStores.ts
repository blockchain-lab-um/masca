import { availableVCStores } from '../../veramo/plugins/availableVCStores';

export function getAvailableVCStores(): string[] {
  return availableVCStores.map((key) => key);
}
