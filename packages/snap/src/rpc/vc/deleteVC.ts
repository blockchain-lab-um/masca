import type { DeleteVCsRequestParams } from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import VeramoService from 'src/veramo/Veramo.service';

import type { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';

export async function deleteVC(
  params: ApiParams,
  args: DeleteVCsRequestParams
): Promise<boolean[]> {
  const { id, options } = args ?? {};
  const { snap } = params;
  const store = options?.store;

  const vcs = await VeramoService.queryCredentials({
    options: { store },
    filter: { type: 'id', filter: id },
  });

  let stores = 'All';
  if (store) {
    if (typeof store === 'string') stores = store;
    else stores = store.join(', ');
  }
  const content = panel([
    heading('Delete VC'),
    text('Are you sure you want to delete this VC?'),
    divider(),
    text(`Store: ${stores}`),
    text(`VCs: ${JSON.stringify(vcs, null, 2)}`),
  ]);

  if (await snapConfirm(snap, content)) {
    const res = await VeramoService.deleteCredential({
      id,
      store,
    });
    return res;
  }

  throw new Error('User rejected the request.');
}
