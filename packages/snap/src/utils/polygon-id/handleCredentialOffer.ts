import {
  base64ToBytes,
  FetchHandler,
  PROTOCOL_CONSTANTS,
} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { VerifiableCredential } from '@veramo/core';

import { ExtensionService } from './Extension.service';

type HandleCredentialOfferParams = {
  credentialOfferMessage: string;
};

export const handleCredentialOffer = async ({
  credentialOfferMessage,
}: HandleCredentialOfferParams): Promise<VerifiableCredential[]> => {
  const { credWallet, dataStorage, packageMgr } =
    ExtensionService.getExtensionServiceInstance();

  const identity = (await dataStorage.identity.getAllIdentities())[0];

  if (!identity) {
    throw new Error('Identity not found');
  }

  try {
    console.log('Fetching credentials...');

    const fetchHandler = new FetchHandler(packageMgr);
    const messageBytes = base64ToBytes(credentialOfferMessage);

    const did = DID.parse(identity.identifier);

    const jwsPackerOpts = {
      mediaType: PROTOCOL_CONSTANTS.MediaType.SignedMessage,
      did: did.string(),
    };

    const credentials = await fetchHandler.handleCredentialOffer({
      did,
      offer: messageBytes,
      packer: jwsPackerOpts,
    });

    console.log(credentials);

    await credWallet.saveAll(credentials);

    return credentials as VerifiableCredential[];
  } catch (e) {
    console.log(e);
    throw e;
  }
};
