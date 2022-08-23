import { SnapProvider } from '@metamask/snap-types';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(wallet: SnapProvider): Promise<string> {
  return await getCurrentDid(wallet);
}
