import { isError } from '@blockchain-lab-um/utils';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import {
  UnsignedCredential,
  UnsignedPresentation,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';
import { DIDSession } from 'did-session';
import { getEthTypesFromInputDoc } from 'eip-712-types-generation';

import { Masca } from './snap.js';

export async function validateAndSetCeramicSession(
  masca: Masca
): Promise<void> {
  // Check if there is valid session in Masca
  const api = masca.getMascaApi();

  const enabledCredentialStoresResult = await api.getCredentialStore();
  if (isError(enabledCredentialStoresResult)) {
    throw new Error('Failed to get enabled VC stores.');
  }

  // Check if ceramic is enabled
  if (enabledCredentialStoresResult.data.ceramic === false) {
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

export async function signVerifiablePresentation(
  presentation: UnsignedPresentation
): Promise<VerifiablePresentation> {
  const addresses: string[] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!presentation.holder.includes(addresses[0])) {
    throw new Error('Wrong holder');
  }

  const chainId = parseInt(
    await window.ethereum.request({ method: 'eth_chainId' }),
    16
  );
  presentation.proof = {
    verificationMethod: `${presentation.holder}#controller`,
    created: presentation.issuanceDate,
    proofPurpose: 'assertionMethod',
    type: 'EthereumEip712Signature2021',
  };

  const message = presentation;

  const domain = {
    chainId,
    name: 'VerifiablePresentation',
    version: '1',
  };

  const primaryType = 'VerifiablePresentation';
  const types = getEthTypesFromInputDoc(presentation, primaryType);

  const data = JSON.stringify({ domain, types, message, primaryType });

  const signature = await window.ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [addresses[0], data],
  });

  presentation.proof.proofValue = signature;

  presentation.proof.eip712 = {
    domain,
    types,
    primaryType,
  };

  return presentation as VerifiablePresentation;
}

export async function signVerifiableCredential(
  credential: UnsignedCredential
): Promise<VerifiableCredential> {
  const addresses: string[] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  let issuer = '';
  if (typeof credential.issuer === 'string') {
    issuer = credential.issuer;
  } else {
    issuer = credential.issuer.id;
  }

  if (!issuer.includes(addresses[0])) {
    throw new Error('Invalid Issuer');
  }

  const chainId = parseInt(
    await window.ethereum.request({ method: 'eth_chainId' }),
    16
  );
  credential.proof = {
    verificationMethod: `${issuer}#controller`,
    created: credential.issuanceDate,
    proofPurpose: 'assertionMethod',
    type: 'EthereumEip712Signature2021',
  };

  const message = credential;

  const domain = {
    chainId,
    name: 'VerifiableCredential',
    version: '1',
  };

  const primaryType = 'VerifiableCredential';
  const allTypes = getEthTypesFromInputDoc(credential, primaryType);
  const types = { ...allTypes };

  const data = JSON.stringify({ domain, types, message, primaryType });

  const signature = await window.ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [addresses[0], data],
  });

  credential.proof.proofValue = signature;

  credential.proof.eip712 = {
    domain,
    types: allTypes,
    primaryType,
  };

  return credential as VerifiableCredential;
}
