import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  verifiableCredential: W3CVerifiableCredential,
  store?: AvailableVCStores | [AvailableVCStores]
) {
  if (typeof store === 'undefined') {
    store = 'snap';
  }
  const { state, wallet, account } = params;
  let promptObj;
  if (typeof store === 'string') {
    promptObj = {
      prompt: 'Save VC',
      description: `Would you like to save the following VC in ${store}?`,
      textAreaContent: JSON.stringify(verifiableCredential).substring(0, 100),
    };
  } else {
    const desc = 'Would you like to save the following VC in ';
    promptObj = {
      prompt: 'Save VC',
      description: desc + store.join(', '),
      textAreaContent: JSON.stringify(verifiableCredential).substring(0, 100),
    };
  }
  if (await snapConfirm(wallet, promptObj)) {
    return await veramoSaveVC(wallet, verifiableCredential, store);
  }
  return false;
}
