import {
  SaveVCRequestParams,
  SaveVCRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
): Promise<SaveVCRequestResult[]> {
  const { store = 'snap' } = options || {};
  const { snap, ethereum } = params;
  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${
      typeof store === 'string' ? store : store.join(', ')
    }?`,
    textAreaContent: JSON.stringify(verifiableCredential).substring(0, 100),
  };

  if (snapConfirm(snap, promptObj)) {
    const res = await veramoSaveVC({
      snap,
      ethereum,
      verifiableCredential,
      store,
    });
    return res;
  }

  throw new Error('User rejected the request.');
}
