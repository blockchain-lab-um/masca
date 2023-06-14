import type { SnapsGlobalObject } from '@metamask/snaps-types';

import type { MascaState } from '../interfaces';
import { initSnapState } from './stateUtils';

export async function init(snap: SnapsGlobalObject): Promise<MascaState> {
  return initSnapState(snap);
}
