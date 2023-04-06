import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { SSISnapState } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const { snap, ethereum, account } = params;
  const res = await getCurrentDid(ethereum, snap, account);
  return res;
}
