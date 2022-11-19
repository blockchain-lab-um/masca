import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

// TODO: CHANGE THIS FUNCTION
export async function setVCStore(params: ApiParams): Promise<boolean> {
  const { state, wallet, account } = params;
  if (state.accountState[account].accountConfig.ssi.vcStore === 'snap') {
    const promptObj = {
      prompt: 'Change vcStore plugin',
      description: 'Would you to start using Ceramic Network?',
      textAreaContent:
        'Every VC from now will be stored on Ceramic Network, until you change this setting. VCs stored on Ceramic Network are synced with other wallets, meaning you will get access to the same VCs on your other wallets with this Account!',
    };
    if (await snapConfirm(wallet, promptObj)) {
      state.accountState[account].accountConfig.ssi.vcStore = 'ceramic';
      await updateSnapState(wallet, state);
      return true;
    }
    return false;
  } else {
    state.accountState[account].accountConfig.ssi.vcStore = 'snap';
    await updateSnapState(wallet, state);
    return true;
  }
}
