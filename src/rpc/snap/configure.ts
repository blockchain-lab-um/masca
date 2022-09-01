/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { SnapProvider } from '@metamask/snap-types';
import { SSISnapState } from '../../interfaces';
import {
  updateInfuraToken,
  togglePopups as updatePopups,
  snapConfirm,
} from '../../utils/snapUtils';
import { getSnapState } from '../../utils/stateUtils';

export async function togglePopups(wallet: SnapProvider): Promise<boolean> {
  const state = await getSnapState(wallet);
  const disablePopups = state.snapConfig.dApp.disablePopups;

  const promptObj = {
    prompt: 'Toggle Popups',
    description: 'Would you like to toggle the popups to following?',
    textAreaContent: disablePopups
      ? 'Current setting: True\nNew setting: False'
      : 'Current setting: False\nNew setting: True',
  };
  const result = disablePopups || (await snapConfirm(wallet, promptObj));
  if (result) {
    await updatePopups(wallet, state);
    return true;
  }
  return false;
}

export async function changeInfuraToken(
  wallet: SnapProvider,
  state: SSISnapState,
  token: string
): Promise<boolean> {
  if (token !== '') {
    const promptObj = {
      prompt: 'Change Infura Token',
      description: 'Would you like to change the infura token to following?',
      textAreaContent: `Current token: ${state.snapConfig.snap.infuraToken}\nNew token: ${token}`,
    };

    if (await snapConfirm(wallet, promptObj)) {
      await updateInfuraToken(wallet, state, token);
      return true;
    }
  }

  return false;
}
