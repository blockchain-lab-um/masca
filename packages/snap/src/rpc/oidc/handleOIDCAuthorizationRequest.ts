import type {
  AvailableVCStores,
  HandleOIDCAuthorizationRequestParams,
} from '@blockchain-lab-um/masca-types';
import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import { isError } from '@blockchain-lab-um/utils';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import elliptic from 'elliptic';
import { snapConfirm } from 'src/utils/snapUtils';

import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import { sign } from '../../utils/sign';
import {
  veramoImportMetaMaskAccount,
  veramoQueryVCs,
} from '../../utils/veramoUtils';
import { getAgent } from '../../veramo/setup';

const { ec: EC } = elliptic;

export async function handleOIDCAuthorizationRequest(
  params: ApiParams,
  handleOIDCAuthorizationRequestParams: HandleOIDCAuthorizationRequestParams
): Promise<string> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const agent = await getAgent(snap, ethereum);

  const authorizationRequestResult =
    await agent.parseOIDCAuthorizationRequestURI({
      authorizationRequestURI:
        handleOIDCAuthorizationRequestParams.authorizationRequestURI,
    });

  if (isError(authorizationRequestResult)) {
    throw new Error(authorizationRequestResult.error);
  }

  const authorizationRequest = authorizationRequestResult.data;

  // TODO: Check all enabled stores
  const store = ['snap'] as AvailableVCStores[];

  const queryResults = await veramoQueryVCs({
    snap,
    ethereum,
    options: { store, returnStore: false },
  });

  const credentials: any = queryResults.map((result) => result.data);

  const selectCredentialsResult = await agent.selectCredentials({
    credentials,
  });

  if (isError(selectCredentialsResult)) {
    throw new Error(selectCredentialsResult.error);
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

  const content = panel([
    heading('Create VC'),
    text('Would you like to create a VC from the following data?'),
    divider(),
    text(`Data:`),
    ...selectedCredentials.map((credential) =>
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
      verifiableCredential: selectedCredentials,
    },
    proofFormat: 'jwt',
    domain,
    challenge,
  });
}
