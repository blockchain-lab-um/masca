import { SetVCStoreRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

export async function setVCStore(
  params: ApiParams,
  { store, value }: SetVCStoreRequestParams
): Promise<boolean> {
  const { state, snap, account } = params;
  if (store !== 'snap') {
    const content = panel([
      heading('Manage VCStore Plugin'),
      text(`Would you like to ${value ? 'enable' : 'disable'} ${store}?`),
    ]);
    if (await snapConfirm(snap, content)) {
      state.accountState[account].accountConfig.ssi.vcStore[store] = value;
      await updateSnapState(snap, state);
      return true;
    }
    return false;
  }
  return false;
}
