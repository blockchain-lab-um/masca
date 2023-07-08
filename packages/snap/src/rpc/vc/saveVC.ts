/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  isJWT,
  isW3CVerifiableCredential,
  type SaveVCRequestParams,
  type SaveVCRequestResult,
} from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';

import type { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
): Promise<SaveVCRequestResult[]> {
  const { store = 'snap' } = options ?? {};
  const { snap, ethereum } = params;

  if (!isW3CVerifiableCredential(verifiableCredential))
    throw new Error('Invalid VC');
  if (typeof verifiableCredential === 'string' && !isJWT(verifiableCredential))
    throw new Error('Invalid JWT string');
  if (typeof store !== 'string' && (!Array.isArray(store) || !store.length))
    throw new Error('Store is invalid format');

  const content = panel([
    heading('Save VC'),
    text('Would you like to save the following VC?'),
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
