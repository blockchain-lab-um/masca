import { SaveVCRequestParams } from '@blockchain-lab-um/ssi-snap-types/params';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
) {
  const { store = 'snap' } = options || {};
  const { wallet } = params;

  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${
      typeof store === 'string' ? store : store.join(', ')
    }?`,
    textAreaContent: JSON.stringify(verifiableCredential).substring(0, 100),
  };

  if (await snapConfirm(wallet, promptObj)) {
    return await veramoSaveVC(wallet, verifiableCredential, store);
  }
  return false;
}
