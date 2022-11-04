import { SnapProvider } from '@metamask/snap-types';
import { VerifiableCredential } from '@veramo/core';
import { ApiParams, SSISnapState } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(params: ApiParams, vc: VerifiableCredential) {
  const { state, wallet, account, bip44Node } = params;
  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${state.accountState[account].accountConfig.ssi.vcStore}?`,
    textAreaContent: JSON.stringify(vc.credentialSubject),
  };
  if (await snapConfirm(wallet, promptObj)) {
    return await veramoSaveVC(
      wallet,
      vc,
      state.accountState[account].accountConfig.ssi.vcStore
    );
  }
  return false;
}
