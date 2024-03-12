import { Result, isError } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { SnapMock, createMockSnap } from '../helpers/snapMock';

describe('handlePolygonFlow', () => {
  let snapMock: SnapsProvider & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    snapMock.rpcMocks.eth_chainId.mockReturnValue('0x89');
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
    await StorageService.init();
  });

  it('should succeed authorization and credential offer for Polygon ID', async () => {
    const resSwitchMethod = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: { didMethod: 'did:polygonid' },
      },
    })) as Result<boolean>;
    if (isError(resSwitchMethod)) {
      throw new Error(resSwitchMethod.error);
    }

    const authorizationRequestResponse = await fetch(
      'https://issuer-v2.polygonid.me/api/sign-in'
    );

    const authorizationRequestResponseJson =
      await authorizationRequestResponse.json();
    const callbackUrl = new URL(
      authorizationRequestResponseJson.body.callbackUrl
    );
    const sessionId = callbackUrl.searchParams.get('sessionId');
    const authorizationRequest = JSON.stringify(
      authorizationRequestResponseJson
    );

    const resHandleAuthRequest = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'handleAuthorizationRequest',
        params: { authorizationRequest },
      },
    })) as Result<string>;

    if (isError(resHandleAuthRequest)) {
      throw new Error(resHandleAuthRequest.error);
    }

    const isAuthorized = await fetch(
      `https://issuer-v2.polygonid.me/api/status?id=${sessionId}`
    );
    const did = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getDID',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(did)) {
      throw new Error(did.error);
    }
    // Credential offer
    const claimUrl = `https://issuer-v2.polygonid.me/api/claim?id=${
      did.data as string
    }&schema=KYCAgeCredential&onchain=false`;

    const requestCredentialOfferBody = {
      url: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json',
      type: 'KYCAgeCredential',
      data: {
        birthday: 19960424,
        documentType: 762117,
      },
      schema: 'KYC Age Credential Merklized',
      expiration: 1893456000,
    };

    const responseCredentialOfferRequest = await fetch(claimUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestCredentialOfferBody),
    });

    if (!responseCredentialOfferRequest.ok) {
      throw new Error(
        `HTTP error! Status: ${responseCredentialOfferRequest.status}`
      );
    }

    const credentialOfferId = await responseCredentialOfferRequest.json();
    const credentialOfferUrl = `https://issuer-v2.polygonid.me/api/offer?id=${credentialOfferId.id}&schema=KYCAgeCredential&onchain=false`;
    const responseCredentialOffer = await fetch(credentialOfferUrl);
    if (!responseCredentialOffer.ok) {
      throw new Error(`HTTP error! Status: ${responseCredentialOffer.status}`);
    }
    const credentialOffer = JSON.stringify(
      await responseCredentialOffer.json()
    );
    const resCredentialOffer = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'handleCredentialOffer',
        params: { credentialOffer },
      },
    })) as Result<string>;

    if (isError(resCredentialOffer)) {
      throw new Error(resCredentialOffer.error);
    }
    const credentialOfferAccepted = resCredentialOffer.data[0];
    expect(credentialOfferAccepted.credentialSchema.id).toBe(
      'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json'
    );
    expect(credentialOfferAccepted.credentialSubject.id).toBe(did.data);
    expect(credentialOfferAccepted.type[1]).toBe('KYCAgeCredential');
    expect(isAuthorized.status).toBe(200);
    expect.assertions(4);
  });
});
