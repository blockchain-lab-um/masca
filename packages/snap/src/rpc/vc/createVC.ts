import { CreateVCRequestParams } from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { VerifiableCredential } from '@veramo/core';
import { ApiParams } from 'src/interfaces';

import { snapConfirm } from '../../utils/snapUtils';
import { veramoCreateVC, veramoSaveVC } from '../../utils/veramoUtils';

export async function createVC(
  params: ApiParams,
  createVCParams: CreateVCRequestParams
): Promise<VerifiableCredential> {
  const { minimalUnsignedCredential, proofFormat, options } = createVCParams;

  const { store = 'snap' } = options || {};
  const { save } = options || {};

  const vc = await veramoCreateVC(params, {
    minimalUnsignedCredential,
    proofFormat,
    options,
  });
  if (save === true) {
    const content = panel([
      heading('Save VC'),
      text('Would you like to save the following VC?'),
      divider(),
      text(`Store(s): ${typeof store === 'string' ? store : store.join(', ')}`),
      text(`VC:`),
      copyable(JSON.stringify(vc, null, 2)),
    ]);

    if (await snapConfirm(snap, content)) {
      await veramoSaveVC({
        snap: params.snap,
        ethereum: params.ethereum,
        verifiableCredential: vc,
        store,
      });
    }
  }

  return vc;
}
