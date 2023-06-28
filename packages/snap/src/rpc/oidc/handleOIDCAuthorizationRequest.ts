import type { HandleOIDCAuthorizationRequestParams } from '@blockchain-lab-um/masca-types';
import { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import type { VerifiableCredential } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import {
  handleAuthorizationRequest,
  sendAuthorizationResponse,
} from '../../utils/oidc';
import { sign } from '../../utils/sign';
import { getAgent } from '../../veramo/setup';

export async function handleOIDCAuthorizationRequest(
  params: ApiParams,
  handleOIDCAuthorizationRequestParams: HandleOIDCAuthorizationRequestParams
): Promise<VerifiableCredential[]> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;
  const { authorizationRequestURI } = handleOIDCAuthorizationRequestParams;

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

  if (did.startsWith('did:ethr') || did.startsWith('did:pkh'))
    throw new Error('did:ethr and did:pkh are not supported');

  const agent = await getAgent(snap, ethereum);

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');

  // TODO: Is this fine or should we improve it ?
  const kid = `${did}#${did.split(':')[2]}`;

  const isDidKeyEbsi =
    state.accountState[account].accountConfig.ssi.didMethod === 'did:key:ebsi';

  // TODO: Select curve based on the key in the identifier ?
  const customSign = async (args: SignArgs) =>
    sign(args, {
      privateKey: res.privateKey,
      curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
      did,
      kid,
    });

  const handleAuthorizationRequestResult = await handleAuthorizationRequest({
    agent,
    authorizationRequestURI,
    customSign,
    did,
  });

  if (handleAuthorizationRequestResult.isUserInteractionRequired) {
    throw new Error('User interaction is required. This is not supported yet');
  }

  const { sendOIDCAuthorizationResponseArgs } =
    handleAuthorizationRequestResult;

  const sendAuthorizationResponseResult = await sendAuthorizationResponse({
    agent,
    sendOIDCAuthorizationResponseArgs,
  });

  console.log(sendAuthorizationResponseResult);

  throw new Error('Not implemented');
}
