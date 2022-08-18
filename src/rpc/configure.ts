/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  updateInfuraToken,
  togglePopups as updatePopups,
} from '../utils/snapUtils';
import { getSnapConfig } from '../utils/stateUtils';

export async function togglePopups(): Promise<boolean> {
  const config = await getSnapConfig();

  const result =
    config.dApp.disablePopups ||
    (await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: 'Toggle Popups',
          description: 'Would you like to toggle the popups to following?',
          textAreaContent:
            'Current setting: ' +
            config.dApp.disablePopups +
            '\n' +
            'New setting: ' +
            !config.dApp.disablePopups,
        },
      ],
    }));
  if (result) {
    await updatePopups();
    return true;
  }
  return false;
}

export async function changeInfuraToken(token?: string): Promise<boolean> {
  if (token != null && token != '') {
    const config = await getSnapConfig();
    const result = await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: 'Change Infura Token',
          description:
            'Would you like to change the infura token to following?',
          textAreaContent:
            'Current token: ' +
            config.snap.infuraToken +
            '\n' +
            'New token: ' +
            token,
        },
      ],
    });
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
