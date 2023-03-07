import {
  QueryVCsRequestParams,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoQueryVCs } from '../../utils/veramoUtils';

export async function queryVCs(
  params: ApiParams,
  args: QueryVCsRequestParams
): Promise<QueryVCsRequestResult[]> {
  const { filter, options } = args || {};
  const { store, returnStore = true } = options || {};
  const { state, snap, ethereum } = params;

  const vcs = await veramoQueryVCs({
    snap,
    ethereum,
    options: { store, returnStore },
    filter,
  });

  const content = panel([
    heading('Share VCs'),
    text('Are you sure you want to share VCs with this dApp?'),
    divider(),
    text(
      `Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is ${vcs.length.toString()}`
    ),
  ]);

  if (
    state.snapConfig.dApp.disablePopups ||
    (await snapConfirm(snap, content))
  ) {
    return vcs;
  }

  return [];
}
