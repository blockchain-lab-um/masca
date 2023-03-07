import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import {
  snapConfirm,
  togglePopups as updatePopups,
} from '../../utils/snapUtils';

export async function togglePopups(params: ApiParams): Promise<boolean> {
  const { state, snap } = params;
  const { disablePopups } = state.snapConfig.dApp;

  const content = panel([
    heading('Disable Popups'),
    text('Would you like to disable popups?'),
    divider(),
    text('If popups are disabled, you will will see less confirmation popups'),
  ]);

  const result = disablePopups || (await snapConfirm(snap, content));
  if (result) {
    await updatePopups(snap, state);
    return true;
  }
  return false;
}
