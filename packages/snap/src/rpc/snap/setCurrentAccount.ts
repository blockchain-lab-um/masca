import { SetCurrentAccountRequestParams } from '@blockchain-lab-um/masca-types';

import { ApiParams } from '../../interfaces';
import { updateSnapState } from '../../utils/stateUtils';

export async function setCurrentAccount(
  params: ApiParams,
  args: SetCurrentAccountRequestParams
): Promise<boolean> {
  const { state, snap } = params;
  const { currentAccount } = args;
  state.currentAccount = currentAccount;
  await updateSnapState(snap, state);
  return true;
}
