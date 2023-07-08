import type {
  SaveVCRequestParams,
  SaveVCRequestResult,
} from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import VeramoService from 'src/veramo/Veramo.service';

import type { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
): Promise<SaveVCRequestResult[]> {
  const { store = 'snap' } = options ?? {};
  const { snap } = params;

  const content = panel([
    heading('Save VC'),
    text('Would you like to save the following VC?'),
    divider(),
    text(`Store(s): ${typeof store === 'string' ? store : store.join(', ')}`),
    text(`VC:`),
    copyable(JSON.stringify(verifiableCredential, null, 2)),
  ]);

  if (await snapConfirm(snap, content)) {
    const res = await VeramoService.saveCredential({
      verifiableCredential,
      store,
    });
    return res;
  }

  throw new Error('User rejected the request.');
}
