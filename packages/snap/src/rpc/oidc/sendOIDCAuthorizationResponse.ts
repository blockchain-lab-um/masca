import type { SendOIDCAuthorizationResponseParams } from '@blockchain-lab-um/masca-types';
import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import { isError } from '@blockchain-lab-um/utils';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { decodeCredentialToObject } from '@veramo/utils';

import type { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import { sign } from '../../utils/sign';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoImportMetaMaskAccount } from '../../utils/veramoUtils';
import { getAgent } from '../../veramo/setup';

export async function sendOIDCAuthorizationResponse(
  params: ApiParams,
  sendOIDCAuthorizationResponseParams: SendOIDCAuthorizationResponseParams
): Promise<boolean> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  if (!sendOIDCAuthorizationResponseParams.credentials) {
    throw new Error('Credentials are required');
  }

  const agent = await getAgent(snap, ethereum);

  const authorizationRequestResult =
    await agent.parseOIDCAuthorizationRequestURI({
      authorizationRequestURI:
        sendOIDCAuthorizationResponseParams.authorizationRequestURI,
    });

  if (isError(authorizationRequestResult)) {
    throw new Error(authorizationRequestResult.error);
  }

  const selectCredentialsResult = await agent.selectCredentials({
    credentials: sendOIDCAuthorizationResponseParams.credentials as any,
  });

  if (isError(selectCredentialsResult)) {
    throw new Error("No credentials match the verifier's request");
  }

  const selectedCredentials = selectCredentialsResult.data;

  const createPresentationSubmissionResult =
    await agent.createPresentationSubmission({
      credentials: selectedCredentials,
    });

  if (isError(createPresentationSubmissionResult)) {
    throw new Error(createPresentationSubmissionResult.error);
  }

  const presentationSubmission = createPresentationSubmissionResult.data;

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

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');

  const did = await getCurrentDid({
    account,
    ethereum,
    snap,
    state,
    bip44CoinTypeNode,
  });

  const kid = `${did}#controllerKey`;

  const customSign = async (args: SignArgs) =>
    sign(args, { privateKey: res.privateKey, did, kid });

  const createIdTokenResult = await agent.createIdToken({
    sign: customSign,
  });

  if (isError(createIdTokenResult)) {
    throw new Error(createIdTokenResult.error);
  }

  const idToken = createIdTokenResult.data;

  const decodedCredentials = selectedCredentials.map((credential) =>
    decodeCredentialToObject(credential)
  );

  const content = panel([
    heading('Create VP'),
    text('Would you like to create a VP from the following data?'),
    divider(),
    text(`Data:`),
    ...decodedCredentials.map((credential) =>
      copyable(JSON.stringify(credential, null, 2))
    ),
  ]);

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

  if (
    !state.snapConfig.dApp.disablePopups &&
    !(await snapConfirm(snap, content))
  ) {
    throw new Error('User rejected create VP request');
  }

  const presentation = await agent.createVerifiablePresentation({
    presentation: {
      holder: identifier.did,
      verifiableCredential: decodedCredentials,
    },
    proofFormat: 'jwt',
    domain,
    challenge,
  });

  const sendOIDCAuthorizationResponseResult =
    await agent.sendOIDCAuthorizationResponse({
      idToken,
      presentationSubmission,
      verifiablePresentation: presentation,
    });

  if (isError(sendOIDCAuthorizationResponseResult)) {
    throw new Error(sendOIDCAuthorizationResponseResult.error);
  }

  return sendOIDCAuthorizationResponseResult.data;
}
