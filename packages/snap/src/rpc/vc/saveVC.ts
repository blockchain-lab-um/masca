import {
  SaveVCRequestParams,
  SaveVCRequestResult,
} from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
): Promise<SaveVCRequestResult[]> {
  const { store = 'snap' } = options || {};
  const { snap, ethereum } = params;

  const content = panel([
    heading('Save VC'),
    text('Would you like to save following VC?'),
    divider(),
    text(`Store(s): ${typeof store === 'string' ? store : store.join(', ')}`),
    text(`VC:`),
    copyable(JSON.stringify(verifiableCredential, null, 2)),
  ]);

  if (await snapConfirm(snap, content)) {
    const res = await veramoSaveVC({
      snap,
      ethereum,
      verifiableCredential,
      store,
    });
    return res;
  }

  throw new Error('User rejected the request.');
}
