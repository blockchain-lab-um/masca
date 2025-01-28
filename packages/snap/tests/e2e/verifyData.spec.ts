import { type Result, isError } from '@blockchain-lab-um/utils';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import type {
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';
import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';

describe('verifyData', () => {
  let snapMock: SnapsProvider & SnapMock;
  let agent: Agent;
  let generatedVC: VerifiableCredential;

  beforeAll(async () => {
    snapMock = createMockSnap();
    const defaultSnapState = getDefaultSnapState(account);

    defaultSnapState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.account.ssi.storesEnabled.ceramic = false;

    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultSnapState,
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await StorageService.init();
    agent = await VeramoService.createAgent();

    // Create test identifier for issuing the VC
    const identifier = await agent.didManagerCreate({
      provider: 'did:ethr',
      kms: 'snap',
    });

    // Create test VC
    const res = await createTestVCs({
      agent,
      proofFormat: 'jwt',
      payload: {
        issuer: identifier.did,
        ...EXAMPLE_VC_PAYLOAD,
      },
    });
    generatedVC = res.exampleVeramoVCJWT;

    // Created VC should be valid
    const verifyResult = await agent.verifyCredential({
      credential: generatedVC,
    });

    if (verifyResult.verified === false) {
      throw new Error('Generated VC is not valid');
    }
  });

  beforeEach(async () => {
    await agent.clear({ options: { store: ['snap'] } });
  });

  it('should succeed verifiying a VC', async () => {
    const verifyDataResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          credential: generatedVC,
        },
      },
    })) as Result<boolean>;

    if (isError(verifyDataResult)) {
      throw new Error(verifyDataResult.error);
    }

    expect(verifyDataResult.data).toBe(true);
    expect.assertions(1);
  });

  it('should succeed verifying a VP', async () => {
    const switchMethodResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: {
          didMethod: 'did:key',
        },
      },
    })) as Result<string>;

    if (isError(switchMethodResult)) {
      throw new Error(switchMethodResult.error);
    }

    const createPresentationResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'createPresentation',
        params: {
          vcs: [generatedVC],
        },
      },
    })) as Result<VerifiablePresentation>;

    if (isError(createPresentationResult)) {
      throw new Error(createPresentationResult.error);
    }

    const verified = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          presentation: createPresentationResult.data,
        },
      },
    })) as Result<boolean>;

    if (isError(verified)) {
      throw new Error(verified.error);
    }

    expect(verified.data).toBe(true);
    expect.assertions(1);
  });

  it.todo('should succeed verifying a VP with domain and challenge');
});
