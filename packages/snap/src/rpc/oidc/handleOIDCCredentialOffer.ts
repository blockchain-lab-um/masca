import type { HandleOIDCCredentialOfferRequestParams } from '@blockchain-lab-um/masca-types';
import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import type { CredentialRequest } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import { heading, panel } from '@metamask/snaps-ui';
import type { VerifiableCredential } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import type { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import { sign } from '../../utils/sign';
import { getAgent } from '../../veramo/setup';

export async function handleOIDCCredentialOffer(
  params: ApiParams,
  handleOIDCCredentialOfferParams: HandleOIDCCredentialOfferRequestParams
): Promise<VerifiableCredential> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const agent = await getAgent(snap, ethereum);

  const credentialOfferResult = await agent.parseOIDCCredentialOfferURI({
    credentialOfferURI: handleOIDCCredentialOfferParams.credentialOfferURI,
  });

  if (isError(credentialOfferResult)) {
    throw new Error(credentialOfferResult.error);
  }

  const credentialOffer = credentialOfferResult.data;

  const { credentials, grants } = credentialOffer;

  const isPinRequired =
    grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']
      ?.user_pin_required ?? false;

  let pin;

  // Ask user for PIN
  if (isPinRequired) {
    pin = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'prompt',
        content: panel([
          heading('Please enter the PIN you received from the issuer'),
        ]),
        placeholder: 'PIN...',
      },
    });

    if (!pin || typeof pin !== 'string') {
      throw new Error('PIN is required');
    }
  }

  const tokenRequestResult = await agent.sendTokenRequest(pin ? { pin } : {});

  if (isError(tokenRequestResult)) {
    throw new Error(tokenRequestResult.error);
  }

  // TODO: Handle multiple credentials
  let selectedCredential = credentials[0];

  if (typeof selectedCredential === 'string') {
    const getCredentialResult = await agent.getCredentialInfoById({
      id: selectedCredential,
    });

    if (isError(getCredentialResult)) {
      throw new Error(getCredentialResult.error);
    }

    selectedCredential = getCredentialResult.data;
  }

  const credentialRequest: CredentialRequest =
    selectedCredential.format === 'mso_mdoc'
      ? {
          format: 'mso_mdoc',
          doctype: selectedCredential.doctype,
        }
      : {
          format: selectedCredential.format,
          types: selectedCredential.types,
        };

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode,
    state,
    account,
    snap
  );

  if (res === null) throw new Error('Could not get keys from address');

  const did = await getCurrentDid({
    account,
    ethereum,
    snap,
    state,
    bip44CoinTypeNode,
  });

  // if(did.startsWith('did:ethr') || did.startsWith('did:pkh')) throw new Error('did:ethr and did:pkh are not supported');

  const kid = did.startsWith('did:ethr')
    ? `${did}#controllerKey`
    : `${did}#${did.split(':')[2]}`;

  const customSign = async (args: SignArgs) =>
    sign(args, { privateKey: res.privateKey, did, kid });

  // Create proof of possession
  const proofOfPossessionResult = await agent.proofOfPossession({
    sign: customSign,
  });

  if (isError(proofOfPossessionResult)) {
    throw new Error(proofOfPossessionResult.error);
  }

  credentialRequest.proof = proofOfPossessionResult.data;

  const credentialRequestResult = await agent.sendCredentialRequest(
    credentialRequest
  );

  if (isError(credentialRequestResult)) {
    throw new Error(credentialRequestResult.error);
  }

  const credentialResponse = credentialRequestResult.data;

  console.log(credentialResponse);

  if (!credentialResponse.credential) {
    throw new Error('An error occurred while requesting the credential');
  }

  const credential = decodeCredentialToObject(credentialResponse.credential);

  return credential;
}
