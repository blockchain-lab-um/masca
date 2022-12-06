/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { ChangeInfuraTokenRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import {
  updateInfuraToken,
  togglePopups as updatePopups,
  snapConfirm,
} from '../../utils/snapUtils';

export async function togglePopups(params: ApiParams): Promise<boolean> {
  const { state, wallet } = params;
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
  params: ApiParams,
  { infuraToken }: ChangeInfuraTokenRequestParams
): Promise<boolean> {
  const { state, wallet } = params;
  if (infuraToken !== '') {
    const promptObj = {
      prompt: 'Change Infura Token',
      description: 'Would you like to change the infura token to following?',
      textAreaContent: `Current token: ${state.snapConfig.snap.infuraToken}\nNew token: ${infuraToken}`,
    };

    if (await snapConfirm(wallet, promptObj)) {
      await updateInfuraToken(wallet, state, infuraToken);
      return true;
    }
  }

  return false;
}
