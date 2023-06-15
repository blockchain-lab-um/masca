import { isError } from '@blockchain-lab-um/utils';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import detectEthereumProvider from '@metamask/detect-provider';
import { DIDSession } from 'did-session';

import { Masca } from './snap.js';

export async function verifyAndSetCeramicSession(masca: Masca) {
  // Check if there is valid session in Masca
  const api = masca.getMascaApi();
  const session = await api.verifyStoredCeramicSessionKey();
  if (!isError(session)) {
    return true;
  }

  // Start new session if there is no valid session
  const ethProvider = await detectEthereumProvider();
  if (!ethProvider) {
    return { success: false, error: 'No ethereum provider found.' };
  }
  const addresses = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const accountId = await getAccountId(ethProvider, (addresses as string[])[0]);
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
    return { success: false, error: 'User failed to sign session.' };
  }
  const serializedSession = newSession.serialize();
  const result = await api.setCeramicSessionKey(serializedSession);
  if (isError(result)) {
    return {
      success: false,
      error:
        'Failed to set session in Masca. Please try again or save VC in Local storage only!.',
    };
  }
  return true;
}
