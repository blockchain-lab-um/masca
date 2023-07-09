import type {
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { updateSnapState } from './stateUtils';

export async function changeCurrentVCStore(params: {
  snap: SnapsGlobalObject;
  state: MascaState;
  account: string;
  didStore: AvailableVCStores;
  value: boolean;
}): Promise<void> {
  const { state, account, didStore, value } = params;
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(state);
}
