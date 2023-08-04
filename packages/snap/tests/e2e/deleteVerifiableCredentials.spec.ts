import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { VerifiableCredential } from '@veramo/core';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import type { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import examplePayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('deleteCredential', () => {
  let ceramicData: StoredCredentials;
  let snapMock: SnapsGlobalObject & SnapMock;
  let agent: Agent;
  let generatedVC: VerifiableCredential;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
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
    const res = await createTestVCs(
      {
        agent,
        proofFormat: 'jwt',
        payload: {
          issuer: identifier.did,
          ...examplePayload,
        },
      }
    );
    generatedVC = res.exampleVeramoVCJWT;

    // Created VC should be valid
    const verifyResult = await agent.verifyCredential({
      credential: generatedVC,
    });

    if (verifyResult.verified === false) {
      throw new Error('Generated VC is not valid');
    }

    // Ceramic mock
    DIDDataStore.prototype.get = jest
      .fn()
      .mockImplementation(async (_key, _did) => Promise.resolve(ceramicData));

    DIDDataStore.prototype.merge = jest.fn().mockImplementation(
      async (_key, content, _options?) =>
        new Promise((resolve) => {
          ceramicData = content as StoredCredentials;
          resolve(ceramicData);
        })
    );
  });

  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    // Clear stores before each test
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

  it('should succeed saving and deleting 1 VC', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveCredential',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    expect(saveRes.data).toEqual([
      {
        id: expect.any(String),
        store: ['snap'],
      },
    ]);

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'deleteCredential',
        params: {
          id: saveRes.data[0].id,
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual([true, false]);
    const result = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(result)) {
      throw new Error(result.error);
    }

    expect(result.data).toHaveLength(0);

    expect.assertions(3);
  });

  it('should succeed saving and deleting 1 VC with store', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveCredential',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    expect(saveRes.data).toEqual([
      {
        id: expect.any(String),
        store: ['snap'],
      },
    ]);

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'deleteCredential',
        params: {
          id: saveRes.data[0].id,
          options: { store: 'snap' },
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual([true]);

    const result = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(result)) {
      throw new Error(result.error);
    }

    expect(result.data).toHaveLength(0);

    expect.assertions(3);
  });

  it('should fail deleting 1 VC with wrong id', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveCredential',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    expect(saveRes.data).toEqual([
      {
        id: expect.any(String),
        store: ['snap'],
      },
    ]);

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'deleteCredential',
        params: {
          id: 'wrong_id',
          options: { store: 'snap' },
        },
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe('Error: No VC found with the given id');

    const result = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(result)) {
      throw new Error(result.error);
    }

    expect(result.data).toHaveLength(1);

    expect.assertions(3);
  });
});
