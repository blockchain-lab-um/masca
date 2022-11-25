import { veramoListVCs } from '../../utils/veramoUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';

export async function queryVCs(
  params: ApiParams,
  filter?: { type: string; filter: any },
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
    returnStore?: boolean;
  }
): Promise<VerifiableCredential[]> {
  let store = options?.store;
  let retStore = options?.returnStore;
  if (typeof store === 'undefined') {
    store = ['snap'];
  }
  if (typeof store === 'string') {
    store = [store];
  }
  if (typeof retStore === 'undefined') {
    retStore = false;
  }
  if (typeof filter === 'undefined') {
    filter = { type: 'none', filter: {} };
  }
  const { state, wallet, account } = params;
  const vcs = await veramoListVCs(wallet, store, filter?.filter as VCQuery);
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
