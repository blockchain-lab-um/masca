import type {
  AvailableVCStores,
  HandleOIDCAuthorizationRequestParams,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import type { VerifiableCredential } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';

import type { ApiParams } from '../../interfaces';
import { veramoQueryVCs } from '../../utils/veramoUtils';
import { getAgent } from '../../veramo/setup';

export async function handleOIDCAuthorizationRequest(
  params: ApiParams,
  handleOIDCAuthorizationRequestParams: HandleOIDCAuthorizationRequestParams
): Promise<VerifiableCredential[]> {
  const { ethereum, snap, bip44CoinTypeNode } = params;

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

  // TODO: Check all enabled stores
  const store = ['snap'] as AvailableVCStores[];

  const queryResults = await veramoQueryVCs({
    snap,
    ethereum,
    options: { store, returnStore: false },
  });

  console.log(queryResults);

  const credentials: any = queryResults.map((result) => result.data);

  console.log(credentials);

  const selectCredentialsResult = await agent.selectCredentials({
    credentials,
  });

  console.log(selectCredentialsResult);

  if (isError(selectCredentialsResult)) {
    throw new Error("No credentials match the verifier's request");
  }

  const decodedCredentials = selectCredentialsResult.data.map((credential) =>
    decodeCredentialToObject(credential)
  );

  return decodedCredentials;
}
