import type {
  QueryVCsRequestParams,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import type { ApiParams } from '../../interfaces';
import { addFriendlyDapp, snapConfirm } from '../../utils/snapUtils';
import { veramoQueryVCs } from '../../utils/veramoUtils';

export async function queryVCs(
  params: ApiParams,
  args: QueryVCsRequestParams
): Promise<QueryVCsRequestResult[]> {
  const { filter, options } = args ?? {};
  const { store, returnStore = true } = options ?? {};
  const { state, snap, ethereum, origin } = params;

  const vcs = await veramoQueryVCs({
    snap,
    ethereum,
    options: { store, returnStore },
    filter: filter && filter.type && filter.filter ? filter : undefined,
  });

  const content = panel([
    heading('Share VCs'),
    text('Are you sure you want to share VCs with this dApp?'),
    divider(),
    text(
      `Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your VCs! Number of VCs submitted is ${vcs.length.toString()}`
    ),
    text('This popup will not appear again for this dApp.'),
  ]);

  if (
    state.snapConfig.dApp.friendlyDapps.includes(origin) ||
    (await snapConfirm(snap, content))
  ) {
    await addFriendlyDapp(snap, state, origin);
    return vcs;
  }

  return [];
}
