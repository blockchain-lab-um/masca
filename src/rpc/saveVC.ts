import { VerifiableCredential } from '@veramo/core';
import { save_vc } from '../utils/veramoUtils';

export async function saveVC(vc?: VerifiableCredential) {
  if (vc) {
    const result = await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: 'Save VC',
          description: 'Would you like to save the following VC?',
          textAreaContent: JSON.stringify(vc.credentialSubject),
        },
      ],
    });
    if (result) {
      await save_vc(vc);
      return { data: true };
    } else {
      return { data: false, error: 'Request declined' };
    }
  } else {
    console.log('Missing parameters: vc');
    return { error: 'Missing parameter: vc' };
  }
}
