import type {
  AvailableVCStores,
  HandleOIDCCredentialOfferRequestParams,
} from '@blockchain-lab-um/masca-types';
import type {
  SendOIDCAuthorizationResponseArgs,
  SignArgs,
} from '@blockchain-lab-um/oidc-client-plugin';
import type { CredentialRequest } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import { heading, panel } from '@metamask/snaps-ui';
import type { VerifiableCredential } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import type { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import { sign } from '../../utils/sign';
import {
  veramoImportMetaMaskAccount,
  veramoQueryVCs,
} from '../../utils/veramoUtils';
import { getAgent } from '../../veramo/setup';

export async function handleOIDCCredentialOffer(
  params: ApiParams,
  handleOIDCCredentialOfferParams: HandleOIDCCredentialOfferRequestParams
): Promise<VerifiableCredential> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const did = await getCurrentDid({
    account,
    ethereum,
    snap,
    state,
    bip44CoinTypeNode,
  });

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

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');

  const kid = did.startsWith('did:ethr')
    ? `${did}#controllerKey`
    : `${did}#${did.split(':')[2]}`;

  const customSign = async (args: SignArgs) =>
    sign(args, { privateKey: res.privateKey, did, kid });

  if (grants?.authorization_code) {
    const authorizationRequestURIResult = await agent.getAuthorizationRequest({
      clientId: did,
    });

    if (isError(authorizationRequestURIResult)) {
      throw new Error(authorizationRequestURIResult.error);
    }

    const authorizationRequestURI = authorizationRequestURIResult.data;

    console.log(`authorizationRequestURI: ${authorizationRequestURI}`);

    const authorizationRequestResult =
      await agent.parseOIDCAuthorizationRequestURI({
        authorizationRequestURI,
      });

    if (isError(authorizationRequestResult)) {
      throw new Error(authorizationRequestResult.error);
    }

    const authorizationRequest = authorizationRequestResult.data;
    const sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs =
      {};

    if (authorizationRequest.response_type.includes('id_token')) {
      // Create id token
      const idTokenResult = await agent.createIdToken({
        sign: customSign,
      });

      if (isError(idTokenResult)) {
        throw new Error(idTokenResult.error);
      }

      const idToken = idTokenResult.data;

      sendOIDCAuthorizationResponseArgs.idToken = idToken;
    }

    if (authorizationRequest.response_type.includes('vp_token')) {
      const store = ['snap'] as AvailableVCStores[];

      const queryResults = await veramoQueryVCs({
        snap,
        ethereum,
        options: { store, returnStore: false },
      });

      console.log(queryResults);

      const queriedCredentials: any = queryResults.map((result) => result.data);

      console.log(credentials);

      const selectCredentialsResult = await agent.selectCredentials({
        credentials: queriedCredentials,
      });

      console.log(selectCredentialsResult);

      if (isError(selectCredentialsResult)) {
        throw new Error(selectCredentialsResult.error);
      }

      const createPresentationSubmissionResult =
        await agent.createPresentationSubmission({
          credentials: selectCredentialsResult.data,
        });

      if (isError(createPresentationSubmissionResult)) {
        throw new Error(createPresentationSubmissionResult.error);
      }

      const presentationSubmission = createPresentationSubmissionResult.data;

      const decodedCredentials = selectCredentialsResult.data.map(
        (credential) => decodeCredentialToObject(credential)
      );

      const identifier = await veramoImportMetaMaskAccount(
        {
          snap,
          ethereum,
          state,
          account,
          bip44CoinTypeNode,
        },
        agent
      );

      const getChallengeResult = await agent.getChallenge();

      if (isError(getChallengeResult)) {
        throw new Error(getChallengeResult.error);
      }

      const challenge = getChallengeResult.data;

      const getDomainResult = await agent.getDomain();

      if (isError(getDomainResult)) {
        throw new Error(getDomainResult.error);
      }

      const domain = getDomainResult.data;

      const presentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          verifiableCredential: decodedCredentials,
        },
        proofFormat: 'jwt',
        domain,
        challenge,
      });

      sendOIDCAuthorizationResponseArgs.presentationSubmission =
        presentationSubmission;
      sendOIDCAuthorizationResponseArgs.verifiablePresentation = presentation;

      console.log(presentation);
      // Create vp token
      // const vpTokenResult = await agent.
    }

    // POST /auth-mock/direct_post
    const authorizationResponseResult =
      await agent.sendOIDCAuthorizationResponse(
        sendOIDCAuthorizationResponseArgs
      );

    if (isError(authorizationResponseResult)) {
      throw new Error(authorizationResponseResult.error);
    }

    // token request

    // Credential request

    throw new Error('Unsupported grant type');
  } else if (grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']) {
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

    // Create proof of possession
    const proofOfPossessionResult = await agent.proofOfPossession({
      sign: customSign,
    });

    if (isError(proofOfPossessionResult)) {
      throw new Error(proofOfPossessionResult.error);
    }

    credentialRequest.proof = proofOfPossessionResult.data;

    // if(did.startsWith('did:ethr') || did.startsWith('did:pkh')) throw new Error('did:ethr and did:pkh are not supported');

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
  } else {
    throw new Error('Unsupported grant type');
  }
}
