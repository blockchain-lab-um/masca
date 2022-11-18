/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { ApiParams } from '../../interfaces';
import {
  updateInfuraToken,
  togglePopups as updatePopups,
  snapConfirm,
} from '../../utils/snapUtils';

export async function togglePopups(params: ApiParams): Promise<boolean> {
  const { state, snap } = params;
  const disablePopups = state.snapConfig.dApp.disablePopups;

  const promptObj = {
    prompt: 'Toggle Popups',
    description: 'Would you like to toggle the popups to following?',
    textAreaContent: disablePopups
      ? 'Current setting: True\nNew setting: False'
      : 'Current setting: False\nNew setting: True',
  };
  const result = disablePopups || (await snapConfirm(snap, promptObj));
  if (result) {
    await updatePopups(snap, state);
    return true;
  }
  return false;
}

export async function changeInfuraToken(
  params: ApiParams,
  token: string
): Promise<boolean> {
  const { state, snap } = params;
  if (token !== '') {
    const promptObj = {
      prompt: 'Change Infura Token',
      description: 'Would you like to change the infura token to following?',
      textAreaContent: `Current token: ${state.snapConfig.snap.infuraToken}\nNew token: ${token}`,
    };

    if (await snapConfirm(snap, promptObj)) {
      await updateInfuraToken(snap, state, token);
      return true;
    }
  }

  return false;
}
