import { veramoQueryVCs } from '../../utils/veramoUtils';
import {
  QueryVCsRequestParams,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';

export async function queryVCs(
  params: ApiParams,
  args: QueryVCsRequestParams
): Promise<QueryVCsRequestResult[]> {
  const { filter, options } = args || {};
  const { store, returnStore = true } = options || {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { state, snap, ethereum } = params;

  const vcs = await veramoQueryVCs({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    snap,
    ethereum,
    options: { store, returnStore },
    filter,
  });

  const promptObj = {
    prompt: 'Send VCs',
    description: 'Are you sure you want to send VCs to the dApp?',
    textAreaContent: `Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is ${vcs.length.toString()}`,
  };

  if (state.snapConfig.dApp.disablePopups || snapConfirm(snap, promptObj)) {
    return vcs;
  }

  return [];
}
