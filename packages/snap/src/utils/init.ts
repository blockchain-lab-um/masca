import { SnapsGlobalObject } from '@metamask/snaps-types';

import { MascaState } from '../interfaces';
import { initSnapState } from './stateUtils';

export async function init(snap: SnapsGlobalObject): Promise<MascaState> {
  return initSnapState(snap);
}
