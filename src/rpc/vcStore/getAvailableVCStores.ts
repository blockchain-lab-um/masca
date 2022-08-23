import { availableVCStores } from '../../veramo/plugins/availableVCStores';

export function getAvailableVCStores(): string[] {
  const methods = availableVCStores.map((key) => key);
  return methods as string[];
}
