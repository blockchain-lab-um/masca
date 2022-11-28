import { AvailableMethods, AvailableVCStores } from 'src/constants';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

// TODO: CHANGE THIS FUNCTION
export async function setVCStore(
  params: ApiParams,
  vcStore: AvailableVCStores,
  value: boolean
): Promise<boolean> {
  const { state, wallet, account } = params;
  if (vcStore != 'snap') {
    const promptObj = {
      prompt: 'Change vcStore plugin',
      description: `Would you like to ${
        value ? 'enable' : 'disable'
      } ${vcStore} vcStore plugin?`,
      textAreaContent: ``,
    };
    if (await snapConfirm(wallet, promptObj)) {
      state.accountState[account].accountConfig.ssi.vcStore[vcStore] = value;
      await updateSnapState(wallet, state);
      return true;
    }
    return false;
  } else {
    state.accountState[account].accountConfig.ssi.vcStore = 'snap';
    await updateSnapState(wallet, state);
    return true;
  }
  return false;
}
