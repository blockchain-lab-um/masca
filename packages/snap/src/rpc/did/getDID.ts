import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { SSISnapState } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: {
  state: SSISnapState;
  snap: SnapsGlobalObject;
  account: string;
  ethereum: MetaMaskInpageProvider;
}): Promise<string> {
  const res = await getCurrentDid(params);
  return res;
}
