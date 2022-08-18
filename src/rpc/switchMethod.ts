import { availableMethods } from '../did/didMethods';
import { changeCurrentMethod, getCurrentMethod } from '../utils/didUtils';

export async function switchMethod(didMethod: string): Promise<boolean> {
  const method = await getCurrentMethod();
  if (!availableMethods.find((k) => k === didMethod)) {
    throw new Error('did method not supported');
  }
  if (didMethod != method) {
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
        await changeCurrentMethod(didMethod as typeof availableMethods[number]);
      }
      return true;
    }
  }
  return false;
}
