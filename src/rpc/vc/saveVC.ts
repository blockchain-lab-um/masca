import { SnapProvider } from '@metamask/snap-types';
import { VerifiableCredential } from '@veramo/core';
import { getCurrentVCStore } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(wallet: SnapProvider, vc?: VerifiableCredential) {
  if (vc) {
    const vcStore = await getCurrentVCStore(wallet);
    const promptObj = {
      prompt: 'Save VC',
      description: `Would you like to save the following VC in ${vcStore}?`,
      textAreaContent: JSON.stringify(vc.credentialSubject),
    };
    if (await snapConfirm(wallet, promptObj)) {
      return await veramoSaveVC(wallet, vc);
    }
    return false;
  }
  return false;
}
