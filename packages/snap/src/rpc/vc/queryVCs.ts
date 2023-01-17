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
  const { state, snap, ethereum } = params;

  const vcs = await veramoQueryVCs({
    snap,
    ethereum,
    options: { store, returnStore },
    filter, // TODO: Check if undefined is ok
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
