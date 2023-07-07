import {
  base64ToBytes,
  byteDecoder,
  hexToBytes,
  PROTOCOL_CONSTANTS,
} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { copyable, heading, panel } from '@metamask/snaps-ui';
import { ES256KSigner } from 'did-jwt';
import { Wallet } from 'ethers';

import { getSnapState } from '../stateUtils';
import { ExtensionService } from './Extension.service';

type HandleAuthorizationRequestParams = {
  authorizationRequestMessage: string;
};
export const handleAuthorizationRequest = async ({
  authorizationRequestMessage,
}: HandleAuthorizationRequestParams) => {
  const { authHandler, dataStorage } =
    ExtensionService.getExtensionServiceInstance();

  const identity = (await dataStorage.identity.getAllIdentities())[0];

  if (!identity) {
    throw new Error('Identity not found');
  }

  const messageObjStr = JSON.stringify(
    JSON.parse(byteDecoder.decode(base64ToBytes(authorizationRequestMessage))),
    null,
    2
  );

  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Authorization is requested'),
        copyable(messageObjStr),
      ]),
    },
  });

  if (!result) {
    throw new Error('User rejected request');
  }

  const messageBytes = base64ToBytes(authorizationRequestMessage);

  try {
    const state = await getSnapState(snap);
    const account = state.currentAccount;

    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
        salt: account,
      },
    });

    const ethWallet = new Wallet(entropy);
    const did = DID.parse(`did:pkh:poly:${ethWallet.address}`);
    const didStr = did.string();

    const jwsPackerOpts = {
      mediaType: PROTOCOL_CONSTANTS.MediaType.SignedMessage,
      did: didStr,
      alg: 'ES256K-R',
      signer: (_: any, msg: any) => async () => {
        const signature = (await ES256KSigner(
          hexToBytes(entropy),
          true
        )(msg)) as string;
        return signature;
      },
    };

    const { token, authRequest } =
      await authHandler.handleAuthorizationRequestForGenesisDID({
        did,
        request: messageBytes,
        packer: jwsPackerOpts,
      });

    if (!authRequest.body?.callbackUrl) {
      throw new Error('Callback url missing in authorization request');
    }

    await fetch(`${authRequest.body.callbackUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: token,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};
