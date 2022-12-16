import { SnapsGlobalObject } from '@metamask/snaps-types';
import { getCurrentNetwork } from '../../utils/snapUtils';

export async function getDidPkhIdentifier(
  snap: SnapsGlobalObject,
  account: string
): Promise<string> {
  const network = await getCurrentNetwork(snap);
  if (network === '0x137') {
    return 'eip155:137:' + account;
  } else return 'eip155:1:' + account;
}
