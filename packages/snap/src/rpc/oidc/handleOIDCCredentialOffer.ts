import { HandleOIDCCredentialOfferRequestParams } from '@blockchain-lab-um/masca-types';
import { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import { CredentialRequest } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import { heading, panel } from '@metamask/snaps-ui';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256.js';

import { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';
import { snapGetKeysFromAddress } from '../../utils/keyPair';
import { getAgent } from '../../veramo/setup';
import { saveVC } from '../vc/saveVC';

const { ec: EC } = elliptic;

export async function handleOIDCCredentialOffer(
  params: ApiParams,
  handleOIDCCredentialOfferParams: HandleOIDCCredentialOfferRequestParams
): Promise<string> {
  const { account, ethereum, snap, state, bip44CoinTypeNode } = params;

  if (!bip44CoinTypeNode) {
    throw new Error('bip44CoinTypeNode is required');
  }

  const agent = await getAgent(snap, ethereum);

  const credentialOfferResult = await agent.parseOIDCCredentialOfferURI({
    credentialOfferURI: handleOIDCCredentialOfferParams.credentialOfferURI,
  });

  console.log(credentialOfferResult);

  if (isError(credentialOfferResult)) {
    throw new Error(credentialOfferResult.error);
  }

  const credentialOffer = credentialOfferResult.data;

  const { credentials } = credentialOffer;

  console.log(credentialOffer);

  // Ask user for PIN
  const pin = await snap.request({
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

  console.log(pin);

  const tokenRequestResult = await agent.tokenRequest({ pin });

  console.log(tokenRequestResult);

  if (isError(tokenRequestResult)) {
    throw new Error(tokenRequestResult.error);
  }

  const tokenResponse = tokenRequestResult.data;

  console.log(tokenResponse);

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

  const kid = `${did}#controllerKey`;

  const sign = async (args: SignArgs) => {
    const ctx = new EC('secp256k1');
    console.log('signing');
    console.log(res.privateKey);
    const ecPrivateKey = ctx.keyFromPrivate(res.privateKey.slice(2));

    const jwtPayload = {
      ...args.payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    const jwtHeader = {
      ...args.header,
      alg: 'ES256K',
      kid,
    };

    const signingInput = [
      encodeBase64url(JSON.stringify(jwtHeader)),
      encodeBase64url(JSON.stringify(jwtPayload)),
    ].join('.');

    const hash = sha256(Buffer.from(signingInput));

    const signature = ecPrivateKey.sign(hash);

    const signatureBuffer = Buffer.concat([
      signature.r.toArrayLike(Buffer, 'be', 32),
      signature.s.toArrayLike(Buffer, 'be', 32),
    ]);

    const signatureBase64 = bytesToBase64url(signatureBuffer);

    const signedJwt = [signingInput, signatureBase64].join('.');

    console.log(signedJwt);

    return signedJwt;
  };

  // Create proof of possession
  const proofOfPossessionResult = await agent.proofOfPossession({
    sign,
  });

  if (isError(proofOfPossessionResult)) {
    throw new Error(proofOfPossessionResult.error);
  }

  credentialRequest.proof = proofOfPossessionResult.data;

  const credentialRequestResult = await agent.credentialRequest(
    credentialRequest
  );

  console.log(credentialRequestResult);

  if (isError(credentialRequestResult)) {
    throw new Error(credentialRequestResult.error);
  }

  const credentialResponse = credentialRequestResult.data;

  console.log(credentialResponse);

  if (credentialResponse.credential) {
    await saveVC(params, {
      verifiableCredential: credentialResponse.credential,
    });
  }

  return '';
}
