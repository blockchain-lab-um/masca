import type { HandleOIDCAuthorizationRequestParams } from '@blockchain-lab-um/masca-types';
import { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import type { VerifiableCredential } from '@veramo/core';

import {
  getAddressKeyDeriver,
  snapGetKeysFromAddress,
} from '../../utils/keyPair';
import {
  handleAuthorizationRequest,
  sendAuthorizationResponse,
} from '../../utils/oidc';
import { sign } from '../../utils/sign';
import { getSnapState } from '../../utils/stateUtils';
import VeramoService from '../../veramo/Veramo.service';

export async function handleOIDCAuthorizationRequest(
  handleOIDCAuthorizationRequestParams: HandleOIDCAuthorizationRequestParams
): Promise<VerifiableCredential[]> {
  const { authorizationRequestURI } = handleOIDCAuthorizationRequestParams;

  const state = await getSnapState();
  const bip44CoinTypeNode = await getAddressKeyDeriver({
    state,
    snap,
    account: state.currentAccount,
  });

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const identifier = await VeramoService.getIdentifier();

  const { did } = identifier;

  if (did.startsWith('did:ethr') || did.startsWith('did:pkh'))
    throw new Error('did:ethr and did:pkh are not supported');

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account: state.currentAccount,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');

  // TODO: Is this fine or should we improve it ?
  const kid = `${did}#${did.split(':')[2]}`;

  const isDidKeyEbsi =
    state.accountState[state.currentAccount].accountConfig.ssi.didMethod ===
    'did:key:jwk_jcs-pub';

  // TODO: Select curve based on the key in the identifier ?
  const customSign = async (args: SignArgs) =>
    sign(args, {
      privateKey: res.privateKey,
      curve: isDidKeyEbsi ? 'p256' : 'secp256k1',
      did,
      kid,
    });

  const handleAuthorizationRequestResult = await handleAuthorizationRequest({
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
    sendOIDCAuthorizationResponseArgs,
  });

  console.log(sendAuthorizationResponseResult);

  throw new Error('Not implemented');
}
