import type { MascaState } from '@blockchain-lab-um/masca-types';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { initSnapState } from './stateUtils';

export async function init(snap: SnapsGlobalObject): Promise<MascaState> {
  return initSnapState();
}
