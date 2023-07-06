import {
  base64ToBytes,
  byteDecoder,
  PROTOCOL_CONSTANTS,
} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { copyable, heading, panel } from '@metamask/snaps-ui';

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
    const did = DID.parse(identity.identifier);

    const jwsPackerOpts = {
      mediaType: PROTOCOL_CONSTANTS.MediaType.SignedMessage,
      did: did.string(),
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
