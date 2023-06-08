import { SetCurrentAccountRequestParams } from '@blockchain-lab-um/masca-types';

import { ApiParams } from '../../interfaces';
import { getMascaAddressIndex } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

export async function setCurrentAccount(
  params: ApiParams,
  args: SetCurrentAccountRequestParams
): Promise<boolean> {
  const { state, snap } = params;
  const { currentAccount } = args;
  state.currentAccount = currentAccount;
  const index = await getMascaAddressIndex({ account: currentAccount });
  await updateSnapState(snap, state);
  return true;
}
