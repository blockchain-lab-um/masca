import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';

import { onRpcRequest } from '../../src';
import { getAgent, type Agent } from '../../src/veramo/setup';
import { account, importablePrivateKey } from '../data/constants';
import examplePayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('verifyData', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let agent: Agent;
  let generatedVC: VerifiableCredential;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    agent = await getAgent(snapMock, ethereumMock);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    const identifier = await agent.didManagerCreate({
      provider: 'did:ethr',
      kms: 'snap',
    });
    await agent.keyManagerImport(importablePrivateKey);
    const res = await createTestVCs(
      {
        agent,
        proofFormat: 'jwt',
        payload: {
          issuer: identifier.did,
          ...examplePayload,
        },
      },
      {
        keyRef: 'importedTestKey',
      }
    );
    generatedVC = res.exampleVeramoVCJWT;
    console.log('generatedVC', generatedVC);

    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
  });

  beforeEach(async () => {
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

  it('should succeed verifiying a VC', async () => {
    const verified = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          credential: generatedVC,
        },
      },
    })) as Result<boolean>;

    if (isError(verified)) {
      throw new Error(verified.error);
    }

    expect(verified.data).toBe(true);
    expect.assertions(1);
  });

  it('should succeed verifying a VP', async () => {
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

    const switchMethod = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: {
          didMethod: 'did:key',
        },
      },
    })) as Result<string>;

    const createdVP = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'createVP',
        params: {
          vcs: [generatedVC],
        },
      },
    })) as Result<VerifiablePresentation>;

    if (isError(createdVP)) {
      throw new Error(createdVP.error);
    }

    const verified = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          presentation: createdVP.data,
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
