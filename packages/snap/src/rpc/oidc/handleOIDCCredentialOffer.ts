import type { HandleOIDCCredentialOfferRequestParams } from '@blockchain-lab-um/masca-types';
import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import type {
  CredentialRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { heading, panel } from '@metamask/snaps-ui';
import type { VerifiableCredential } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import type { ApiParams } from '../../interfaces';
import { getCurrentDidIdentifier } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import {
  handleAuthorizationRequest,
  sendAuthorizationResponse,
} from '../../utils/oidc';
import { sign } from '../../utils/sign';
import { veramoImportMetaMaskAccount } from '../../utils/veramoUtils';
import { getAgent } from '../../veramo/setup';

export async function handleOIDCCredentialOffer(
  params: ApiParams,
  handleOIDCCredentialOfferParams: HandleOIDCCredentialOfferRequestParams
): Promise<VerifiableCredential> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const identifier = await getCurrentDidIdentifier({
    account,
    ethereum,
    snap,
    state,
    bip44CoinTypeNode,
  });
  const { did } = identifier;

  if (did.startsWith('did:ethr') || did.startsWith('did:pkh'))
    throw new Error('did:ethr and did:pkh are not supported');

  const agent = await getAgent(snap, ethereum);

  const credentialOfferResult = await agent.parseOIDCCredentialOfferURI({
    credentialOfferURI: handleOIDCCredentialOfferParams.credentialOfferURI,
  });

  if (isError(credentialOfferResult)) {
    throw new Error(credentialOfferResult.error);
  }

  const { credentials, grants } = credentialOfferResult.data;

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');

  await veramoImportMetaMaskAccount(
    {
      ...params,
      did: identifier.did,
      bip44CoinTypeNode,
    },
    agent
  );

  // TODO: Is this fine or should we improve it ?
  const kid = `${identifier.did}#${identifier.did.split(':')[2]}`;

  const isDidKeyEbsi =
    state.accountState[account].accountConfig.ssi.didMethod ===
    'did:key:jwk_jcs-pub';

  // TODO: Select curve based on the key in the identifier ?
  const customSign = async (args: SignArgs) =>
    sign(args, {
      privateKey: res.privateKey,
      curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
      did: identifier.did,
      kid,
    });

  let tokenRequestResult: Result<TokenResponse>;

  if (grants?.authorization_code) {
    const authorizationRequestURIResult = await agent.getAuthorizationRequest({
      clientId: identifier.did,
    });

    if (isError(authorizationRequestURIResult)) {
      throw new Error(authorizationRequestURIResult.error);
    }

    const authorizationRequestURI = authorizationRequestURIResult.data;

    console.log(`authorizationRequestURI: ${authorizationRequestURI}`);

    const handleAuthorizationRequestResult = await handleAuthorizationRequest({
      agent,
      authorizationRequestURI,
      did,
      customSign,
    });

    if (handleAuthorizationRequestResult.isUserInteractionRequired) {
      throw new Error(
        'User interaction is required. This is not supported yet'
      );
    }

    const { sendOIDCAuthorizationResponseArgs } =
      handleAuthorizationRequestResult;

    const sendAuthorizationResponseResult = await sendAuthorizationResponse({
      agent,
      sendOIDCAuthorizationResponseArgs,
    });

    const { code } = sendAuthorizationResponseResult;

    tokenRequestResult = await agent.sendTokenRequest({
      code,
      clientId: did,
    });
  } else if (grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']) {
    // Check if PIN is required
    const isPinRequired =
      grants['urn:ietf:params:oauth:grant-type:pre-authorized_code']
        .user_pin_required ?? false;

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
    tokenRequestResult = await agent.sendTokenRequest(pin ? { pin } : {});
  } else {
    throw new Error('Unsupported grant type');
  }

  if (isError(tokenRequestResult)) {
    throw new Error(tokenRequestResult.error);
  }

  console.log('here');

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
