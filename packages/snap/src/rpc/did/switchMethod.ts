import { SwitchMethodRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import { changeCurrentMethod } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';

export async function switchMethod(
  params: ApiParams,
  { didMethod }: SwitchMethodRequestParams
): Promise<string> {
  const { state, snap, ethereum, account, origin } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  if (didMethod !== method) {
    const content = panel([
      heading('Switch Method'),
      text('Would you like to switch your DID method?'),
      divider(),
      text(`Switching to: ${didMethod}`),
    ]);

    if (await snapConfirm(snap, content)) {
      const res = await changeCurrentMethod(
        snap,
        ethereum,
        state,
        account,
        didMethod,
        origin
      );
      return res;
    }

    throw new Error('User rejected method switch');
  }

  throw new Error('Method already set');
}
