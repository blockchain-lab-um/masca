import { SetCurrentAccountRequestParams } from '@blockchain-lab-um/masca-types';

import { ApiParams } from '../../interfaces';
import { updateSnapState } from '../../utils/stateUtils';

export async function setCurrentAccount(
  params: ApiParams,
  args: SetCurrentAccountRequestParams
): Promise<boolean> {
  const { state, snap } = params;
  const { currentAccount } = args;
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
      salt: currentAccount,
    },
  });
  console.log(entropy);
  state.currentAccount = currentAccount;
  await updateSnapState(snap, state);
  return true;
}
