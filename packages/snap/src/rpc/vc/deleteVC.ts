import { DeleteVCsRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoDeleteVC } from '../../utils/veramoUtils';

export async function deleteVC(
  params: ApiParams,
  args: DeleteVCsRequestParams
): Promise<boolean[]> {
  const { id, options } = args || {};
  const { snap } = params;
  const store = options?.store;
  const promptObj = {
    prompt: 'Delete VC',
    description: `Would you like to delete the following VC?`,
    textAreaContent: `Content`,
  };

  if (await snapConfirm(snap, promptObj)) {
    return await veramoDeleteVC({
      snap,
      id,
      store,
    });
  }
  throw new Error('User rejected');
}
