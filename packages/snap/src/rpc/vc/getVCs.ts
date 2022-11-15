import { veramoListVCs } from '../../utils/veramoUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';
import { AvailableVCStores } from 'src/constants';

export async function getVCs(
  params: ApiParams,
  query?: VCQuery,
  store: AvailableVCStores = 'snap'
): Promise<VerifiableCredential[]> {
  const { state, wallet, account } = params;
  console.log('query', query);
  const vcs = await veramoListVCs(wallet, store, query);
  console.log('VCs: ', vcs);
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
