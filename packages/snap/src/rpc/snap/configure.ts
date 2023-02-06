import { ApiParams } from '../../interfaces';
import {
  togglePopups as updatePopups,
  snapConfirm,
} from '../../utils/snapUtils';

export async function togglePopups(params: ApiParams): Promise<boolean> {
  const { state, snap } = params;
  const { disablePopups } = state.snapConfig.dApp;

  const promptObj = {
    prompt: 'Toggle Popups',
    description: 'Would you like to toggle the popups to following?',
    textAreaContent: disablePopups
      ? 'Current setting: True\nNew setting: False'
      : 'Current setting: False\nNew setting: True',
  };
  const result = disablePopups || snapConfirm(snap, promptObj);
  if (result) {
    await updatePopups(snap, state);
    return true;
  }
  return false;
}
