import { isError, isSuccess } from '@blockchain-lab-um/utils';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { DIDSession } from 'did-session';

import { Masca } from './snap.js';

export async function validateAndSetCeramicSession(
  masca: Masca
): Promise<void> {
  // Check if there is valid session in Masca
  const api = masca.getMascaApi();

  // Check if ceramic is enabled
  const enabledVCStores = await api.getVCStore();
  if (isSuccess(enabledVCStores)) {
    if (enabledVCStores.data.ceramic === false) {
      return;
    }
  }

  const session = await api.validateStoredCeramicSession();
  if (!isError(session)) {
    return;
  }

  const addresses = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const accountId = await getAccountId(
    window.ethereum,
    (addresses as string[])[0]
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const authMethod = await EthereumWebAuth.getAuthMethod(
    window.ethereum,
    accountId
  );
  let newSession;
  try {
    newSession = await DIDSession.authorize(authMethod, {
      expiresInSecs: 60 * 60 * 24,
      resources: [`ceramic://*`],
    });
  } catch (e) {
    throw new Error('User failed to sign session.');
  }
  const serializedSession = newSession.serialize();
  const result = await api.setCeramicSession(serializedSession);
  if (isError(result)) {
    throw new Error('Failed to set session in Masca.');
  }
}
