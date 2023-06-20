import { isError } from '@blockchain-lab-um/utils';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { DIDSession } from 'did-session';

import { Masca } from './snap.js';

export async function validateAndSetCeramicSession(
  masca: Masca
): Promise<void> {
  // Check if there is valid session in Masca
  const api = masca.getMascaApi();

  const enabledVCStoresResult = await api.getVCStore();
  if (isError(enabledVCStoresResult)) {
    throw new Error('Failed to get enabled VC stores.');
  }

  // Check if ceramic is enabled
  if (enabledVCStoresResult.data.ceramic === false) {
    return;
  }

  const session = await api.validateStoredCeramicSession();
  if (!isError(session)) {
    return;
  }

  const addresses: string[] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const accountId = await getAccountId(window.ethereum, addresses[0]);

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
