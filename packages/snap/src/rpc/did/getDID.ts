import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { MascaState } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: {
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  ethereum: MetaMaskInpageProvider;
}): Promise<string> {
  const res = await getCurrentDid(params);
  return res;
}
