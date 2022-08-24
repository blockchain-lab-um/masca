import { SnapProvider } from '@metamask/snap-types';
import { getCurrentVCStore } from '../../utils/didUtils';

export async function getVCStore(wallet: SnapProvider): Promise<string> {
  return await getCurrentVCStore(wallet);
}
