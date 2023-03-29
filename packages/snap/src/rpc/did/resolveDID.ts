import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { resolveDid } from '../../utils/didUtils';

export async function resolveDID(
  did: string,
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider
) {
  if (did === '') return { message: 'DID is empty' };
  const res = await resolveDid(did, snap, ethereum);
  return res;
}
