import { veramoQueryVCs } from '../../utils/veramoUtils';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';
import { QueryRequestParams } from 'src/utils/params';
import { QueryVCSResult } from '../../utils/veramoUtils';

export async function queryVCs(
  params: ApiParams,
  { filter, options }: QueryRequestParams
): Promise<QueryVCSResult[]> {
  const { store, returnStore } = options || {};
  const { state, wallet } = params;
  const vcs = await veramoQueryVCs({
    wallet,
    options: { store, returnStore },
    filter,
  });
  const promptObj = {
    prompt: 'Send VCs',
    description: 'Are you sure you want to send VCs to the dApp?',
    textAreaContent: `Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is ${vcs.length.toString()}`,
  };

  if (
    state.snapConfig.dApp.disablePopups ||
    (await snapConfirm(wallet, promptObj))
  ) {
    return vcs;
  }

  return [];
}
