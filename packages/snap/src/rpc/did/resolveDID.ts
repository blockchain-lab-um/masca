import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { resolveDid } from '../../utils/didUtils';

export async function resolveDID(
  params: {
    snap: SnapsGlobalObject;
    ethereum: MetaMaskInpageProvider;
  },
  did: string
) {
  if (did === '') return { message: 'DID is empty' };
  const res = await resolveDid({ ...params, did });
  return res;
}
