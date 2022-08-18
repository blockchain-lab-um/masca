import { veramoListVCs } from '../utils/veramoUtils';
import { getSnapConfig } from '../utils/stateUtils';
import { VerifiableCredential } from '@veramo/core';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { SnapProvider } from '@metamask/snap-types';

export async function getVCs(
  wallet: SnapProvider,
  query?: VCQuery
): Promise<VerifiableCredential[]> {
  console.log('query', query);
  const vcs = await veramoListVCs(wallet, query);
  const config = await getSnapConfig(wallet);
  console.log('VCs: ', vcs);

  const result =
    config.dApp.disablePopups ||
    (await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: 'Send VCs',
          description: 'Are you sure you want to send VCs to the dApp?',
          textAreaContent:
            'Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is ' +
            vcs.length.toString(),
        },
      ],
    }));
  if (result) {
    return vcs;
  } else {
    return [];
  }
}
