import { VerifiableCredential } from '@veramo/core';
import { AvailableVCStores } from 'src/constants';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  vc: VerifiableCredential,
  store: AvailableVCStores = 'snap'
) {
  const { state, wallet, account } = params;
  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${store}?`,
    textAreaContent: JSON.stringify(vc.credentialSubject),
  };
  if (await snapConfirm(wallet, promptObj)) {
    return await veramoSaveVC(wallet, vc, store);
  }
  return false;
}
