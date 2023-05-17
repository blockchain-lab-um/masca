import { HandleOIDCCredentialOfferRequestParams } from '@blockchain-lab-um/masca-types';

import { ApiParams } from '../../../src/interfaces.js';

export async function handleOIDCCredentialOffer(
  params: ApiParams,
  handleOIDCCredentialOfferParams: HandleOIDCCredentialOfferRequestParams
): Promise<string> {
  const { credentialOfferURI } = handleOIDCCredentialOfferParams;
  console.log(credentialOfferURI);
  console.log('here');
  try {
    //
  } catch (e) {
    console.log(e);
  }

  return '';
}
