import { availableMethods } from '../../did/didMethods';
import { ApiParams } from '../../interfaces';
import { changeCurrentMethod } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';

export async function switchMethod(
  params: ApiParams,
  didMethod: string
): Promise<boolean> {
  const { state, wallet, account, bip44Node } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const newDidMethod = availableMethods.find((k) => k === didMethod);
  if (!newDidMethod) {
    throw new Error('did method not supported');
  }
  if (newDidMethod !== method) {
    if (method !== newDidMethod) {
      const promptObj = {
        prompt: 'Change DID method',
        description: 'Would you like to change did method to the following?',
        textAreaContent: newDidMethod,
      };

      if (await snapConfirm(wallet, promptObj)) {
        await changeCurrentMethod(wallet, state, account, newDidMethod);
        return true;
      }

      return false;
    }
  }
  return false;
}
