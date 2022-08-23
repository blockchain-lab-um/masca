import { SnapProvider } from '@metamask/snap-types';
import { getCurrentMethod } from '../../utils/didUtils';

export async function getMethod(wallet: SnapProvider): Promise<string> {
  return await getCurrentMethod(wallet);
}
