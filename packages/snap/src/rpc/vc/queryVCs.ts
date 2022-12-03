import { veramoListVCs } from '../../utils/veramoUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery, QueryRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';

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
