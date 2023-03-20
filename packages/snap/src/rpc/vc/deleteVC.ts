import { DeleteVCsRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoDeleteVC, veramoQueryVCs } from '../../utils/veramoUtils';

export async function deleteVC(
  params: ApiParams,
  args: DeleteVCsRequestParams
): Promise<boolean[]> {
  const { id, options } = args || {};
  const { snap, ethereum } = params;
  const store = options?.store;

  const vcs = await veramoQueryVCs({
    snap,
    ethereum,
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
    const res = await veramoDeleteVC({
      snap,
      ethereum,
      id,
      store,
    });
    return res;
  }

  throw new Error('User rejected the request.');
}
