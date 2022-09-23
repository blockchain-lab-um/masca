import { SnapProvider } from '@metamask/snap-types';
import { SSISnapState } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(
  wallet: SnapProvider,
  state: SSISnapState,
  account: string
): Promise<string> {
  return await getCurrentDid(wallet, state, account);
}
