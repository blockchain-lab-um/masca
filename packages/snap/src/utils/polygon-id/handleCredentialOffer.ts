import {
  base64ToBytes,
  FetchHandler,
  hexToBytes,
  PROTOCOL_CONSTANTS,
} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { VerifiableCredential } from '@veramo/core';
import { ES256KSigner } from 'did-jwt';
import { Wallet } from 'ethers';

import { getSnapState } from '../stateUtils';
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
    const credentials = await fetchHandler.handleCredentialOffer({
      did,
      offer: messageBytes,
      packer: jwsPackerOpts,
    });

    await credWallet.saveAll(credentials);

    return credentials as VerifiableCredential[];
  } catch (e) {
    console.log(e);
    throw e;
  }
};
