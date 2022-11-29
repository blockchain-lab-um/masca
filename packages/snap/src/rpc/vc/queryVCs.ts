import { veramoListVCs } from '../../utils/veramoUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';
import { ApiParams } from '../../interfaces';
import { QueryFilter, QueryOptions } from 'src/utils/params';

export async function queryVCs(
  params: ApiParams,
  filter?: QueryFilter,
  options?: QueryOptions
): Promise<VerifiableCredential[]> {
  let { store = ['snap'] } = options || {};
  // TODO: Remove this when we start using the returnStore option
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { returnStore = false } = options || {};

  if (typeof store === 'string') {
    store = [store];
  }

  if (typeof filter === 'undefined') {
    filter = { type: 'none', filter: {} };
  }

  const { state, wallet } = params;
  const vcs = await veramoListVCs(wallet, store, filter.filter as VCQuery);
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
