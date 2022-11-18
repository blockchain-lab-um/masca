import { VerifiableCredential } from '@veramo/core';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(params: ApiParams, vc: VerifiableCredential) {
  const { state, snap, account } = params;
  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${state.accountState[account].accountConfig.ssi.vcStore}?`,
    textAreaContent: JSON.stringify(vc.credentialSubject),
  };
  if (await snapConfirm(snap, promptObj)) {
    return await veramoSaveVC(
      snap,
      vc,
      state.accountState[account].accountConfig.ssi.vcStore
    );
  }
  return false;
}
