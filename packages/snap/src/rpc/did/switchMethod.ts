import { SwitchMethodRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { ApiParams } from '../../interfaces';
import { changeCurrentMethod } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';

export async function switchMethod(
  params: ApiParams,
  { didMethod }: SwitchMethodRequestParams
): Promise<string> {
  const { state, snap, account } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  if (didMethod !== method) {
    const promptObj = {
      prompt: 'Change DID method',
      description: 'Would you like to change did method to the following?',
      textAreaContent: didMethod,
    };

    if (await snapConfirm(snap, promptObj)) {
      return await changeCurrentMethod(snap, state, account, didMethod);
    }

    return '';
  }
  return '';
}
