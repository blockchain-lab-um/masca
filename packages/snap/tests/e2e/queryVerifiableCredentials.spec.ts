import { isError, Result } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { VerifiableCredential } from '@veramo/core';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account, importablePrivateKey, jsonPath2 } from '../data/constants';
import examplePayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('queryVerifiableCredentials', () => {
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
    await agent.keyManagerImport(importablePrivateKey);

    // Create test VC
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

  it('should succeed with empty array', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual([]);

    expect.assertions(1);
  });

  it('should succeed with 1 VC matching query - filter by ID', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    const expectedResult = [
      {
        data: generatedVC,
        metadata: {
          id: saveRes.data[0].id,
          store: ['snap'],
        },
      },
    ];

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {
          filter: {
            type: 'id',
            filter: saveRes.data[0].id,
          },
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(expectedResult);

    expect.assertions(1);
  });

  it('should succeed with 1 VC matching query - no filter or store', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    const expectedResult = [
      {
        data: generatedVC,
        metadata: {
          id: saveRes.data[0].id,
          store: ['snap'],
        },
      },
    ];

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(expectedResult);

    expect.assertions(1);
  });

  it('should succeed with 1 VC matching query - store defined', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    const expectedResult = [
      {
        data: generatedVC,
        metadata: {
          id: saveRes.data[0].id,
          store: ['snap'],
        },
      },
    ];

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {
          options: { store: 'snap' },
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(expectedResult);

    expect.assertions(1);
  });

  it('should succeed with 1 VC matching query - without store', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    const expectedResult = [
      {
        data: generatedVC,
        metadata: {
          id: saveRes.data[0].id,
        },
      },
    ];

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {
          options: { returnStore: false },
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(expectedResult);

    expect.assertions(1);
  });

  it('should succeed with 1 VC matching query - filter by JSONPath', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    const expectedResult = [
      {
        data: generatedVC,
        metadata: {
          id: saveRes.data[0].id,
          store: ['snap'],
        },
      },
    ];

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {
          options: { store: 'snap' },
          filter: {
            type: 'JSONPath',
            filter: jsonPath2,
          },
        },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(expectedResult);

    expect.assertions(1);
  });
});
