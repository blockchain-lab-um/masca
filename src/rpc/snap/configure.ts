/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  updateInfuraToken,
  togglePopups as updatePopups,
  snapConfirm,
} from '../../utils/snapUtils';
import { getSnapConfig } from '../../utils/stateUtils';

export async function togglePopups(): Promise<boolean> {
  const config = await getSnapConfig();
  const promptObj = {
    prompt: 'Toggle Popups',
    description: 'Would you like to toggle the popups to following?',
    textAreaContent:
      'Current setting: ' +
      config.dApp.disablePopups +
      '\n' +
      'New setting: ' +
      !config.dApp.disablePopups,
  };
  const result = config.dApp.disablePopups || (await snapConfirm(promptObj));
  if (result) {
    await updatePopups();
    return true;
  }
  return false;
}

export async function changeInfuraToken(token?: string): Promise<boolean> {
  if (token != null && token !== '') {
    const config = await getSnapConfig();
    const promptObj = {
      prompt: 'Change Infura Token',
      description: 'Would you like to change the infura token to following?',
      textAreaContent:
        'Current token: ' +
        config.snap.infuraToken +
        '\n' +
        'New token: ' +
        token,
    };
    const result = await snapConfirm(promptObj);
    if (result) {
      await updateInfuraToken(token);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
