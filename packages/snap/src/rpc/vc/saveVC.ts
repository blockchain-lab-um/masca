import {
  AvailableVCStores,
  SaveVCRequestParams,
} from '@blockchain-lab-um/ssi-snap-types';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-vc-manager';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoSaveVC } from '../../utils/veramoUtils';
import { getEnabledVCStores } from '../../utils/snapUtils';

export async function saveVC(
  params: ApiParams,
  { verifiableCredential, options }: SaveVCRequestParams
): Promise<IDataManagerSaveResult[]> {
  const { store = 'snap' } = options || {};
  const { snap } = params;
  const promptObj = {
    prompt: 'Save VC',
    description: `Would you like to save the following VC in ${
      typeof store === 'string' ? store : store.join(', ')
    }?`,
    textAreaContent: JSON.stringify(verifiableCredential).substring(0, 100),
  };

  if (snapConfirm(snap, promptObj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await veramoSaveVC({
      snap,
      verifiableCredential,
      store,
    });
  }
  throw new Error('User rejected');
}
