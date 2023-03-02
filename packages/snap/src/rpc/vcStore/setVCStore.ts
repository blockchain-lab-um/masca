import { SetVCStoreRequestParams } from '@blockchain-lab-um/ssi-snap-types';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

export async function setVCStore(
  params: ApiParams,
  { store, value }: SetVCStoreRequestParams
): Promise<boolean> {
  const { state, snap, account } = params;
  if (store !== 'snap') {
    const promptObj = {
      prompt: 'Change vcStore plugin',
      description: `Would you like to ${
        value ? 'enable' : 'disable'
      } ${store} vcStore plugin?`,
      textAreaContent: `Content`,
    };
    if (snapConfirm(snap, promptObj)) {
      state.accountState[account].accountConfig.ssi.vcStore[store] = value;
      await updateSnapState(snap, state);
      return true;
    }
    return false;
  }
  return false;
}
