import { DeleteVCsRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoDeleteVC } from '../../utils/veramoUtils';

export async function deleteVC(
  params: ApiParams,
  args: DeleteVCsRequestParams
): Promise<boolean[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { id, options } = args || {};
  const { wallet } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const store = options?.store;
  const promptObj = {
    prompt: 'Delete VC',
    description: `Would you like to delete the following VC?`,
  };

  if (await snapConfirm(wallet, promptObj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await veramoDeleteVC({
      wallet,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store,
    });
  }
  throw new Error('User rejected');
}
