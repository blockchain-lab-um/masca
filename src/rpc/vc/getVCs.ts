import { veramoListVCs } from '../../utils/veramoUtils';
import { getSnapConfig } from '../../utils/stateUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { snapConfirm } from '../../utils/snapUtils';

export async function getVCs(query?: VCQuery): Promise<VerifiableCredential[]> {
  console.log('query', query);
  const vcs = await veramoListVCs(query);
  const config = await getSnapConfig();
  console.log('VCs: ', vcs);
  const promptObj = {
    prompt: 'Send VCs',
    description: 'Are you sure you want to send VCs to the dApp?',
    textAreaContent:
      'Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is ' +
      vcs.length.toString(),
  };
  const result = config.dApp.disablePopups || (await snapConfirm(promptObj));
  if (result) {
    return vcs;
  } else {
    return [];
  }
}
