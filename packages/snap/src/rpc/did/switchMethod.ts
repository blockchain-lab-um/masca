import { SwitchMethodRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import { changeCurrentMethod } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';

export async function switchMethod(
  params: ApiParams,
  { didMethod }: SwitchMethodRequestParams
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { state, snap, ethereum, account } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  if (didMethod !== method) {
    const promptObj = {
      prompt: 'Change DID method',
      description: 'Would you like to change did method to the following?',
      textAreaContent: didMethod,
    };

    if (snapConfirm(snap, promptObj)) {
      const res = await changeCurrentMethod(
        snap,
        ethereum,
        state,
        account,
        didMethod
      );
      return res;
    }

    return '';
  }
  return '';
}
