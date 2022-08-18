import { SnapProvider } from '@metamask/snap-types';
import { availableMethods } from '../did/didMethods';
import { changeCurrentMethod, getCurrentMethod } from '../utils/didUtils';

export async function switchMethod(
  wallet: SnapProvider,
  didMethod: string
): Promise<boolean> {
  const method = await getCurrentMethod(wallet);
  if (!availableMethods.find((k) => k === didMethod)) {
    throw new Error('did method not supported');
  }
  if (didMethod !== method) {
    if (method !== didMethod) {
      const result = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Change DID method',
            description: 'Would you like to change did method to following?',
            textAreaContent: didMethod,
          },
        ],
      });
      if (result) {
        await changeCurrentMethod(
          wallet,
          didMethod as typeof availableMethods[number]
        );
      }
      return true;
    }
  }
  return false;
}
