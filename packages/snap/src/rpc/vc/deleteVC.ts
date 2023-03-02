import { DeleteVCsRequestParams } from '@blockchain-lab-um/ssi-snap-types';

import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoDeleteVC } from '../../utils/veramoUtils';

export async function deleteVC(
  params: ApiParams,
  args: DeleteVCsRequestParams
): Promise<boolean[]> {
  const { id, options } = args || {};
  const { snap, ethereum } = params;
  const store = options?.store;
  const promptObj = {
    prompt: 'Delete VC',
    description: `Would you like to delete the following VC?`,
    textAreaContent: `Content`,
  };

  if (snapConfirm(snap, promptObj)) {
    const res = await veramoDeleteVC({
      snap,
      ethereum,
      id,
      store,
    });
    return res;
  }
  throw new Error('User rejected');
}
