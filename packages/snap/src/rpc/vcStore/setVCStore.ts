import { SetVCStoreRequestParams } from 'src/utils/params';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

// TODO: CHANGE THIS FUNCTION
export async function setVCStore(
  params: ApiParams,
  { store, value }: SetVCStoreRequestParams
): Promise<boolean> {
  const { state, wallet, account } = params;
  if (store !== 'snap') {
    const promptObj = {
      prompt: 'Change vcStore plugin',
      description: `Would you like to ${
        value ? 'enable' : 'disable'
      } ${store} vcStore plugin?`,
      textAreaContent: ``,
    };
    if (await snapConfirm(wallet, promptObj)) {
      state.accountState[account].accountConfig.ssi.vcStore[store] = value;
      await updateSnapState(wallet, state);
      return true;
    }
    return false;
  }
  return false;
}
