import {
  AvailableVCStores,
  SaveVCOptions,
} from '@blockchain-lab-um/masca-types';
import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { IIdentifier, VerifiableCredential } from '@veramo/core';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import type { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account, importablePrivateKey } from '../data/constants';
import examplePayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('saveVerifiableCredential', () => {
  let ceramicData: StoredCredentials;
  let snapMock: SnapsGlobalObject & SnapMock;
  let identifier: IIdentifier;
  let agent: Agent;
  let generatedVC: VerifiableCredential;

  type StoreTests = {
    title: string;
    options?: SaveVCOptions;
    results: string[];
  };

  const options: StoreTests[] = [
    { title: 'snap', options: { store: 'snap' }, results: ['snap'] },
    { title: 'ceramic', options: { store: 'ceramic' }, results: ['ceramic'] },
    { title: '[snap]', options: { store: ['snap'] }, results: ['snap'] },
    {
      title: '[ceramic]',
      options: { store: ['ceramic'] },
      results: ['ceramic'],
    },
    {
      title: 'snap & ceramic',
      options: { store: ['snap', 'ceramic'] },
      results: ['snap', 'ceramic'],
    },
    { title: 'empty options object', options: {}, results: ['snap'] },
    {
      title: 'undefined options object',
      options: undefined,
      results: ['snap'],
    },
  ];
  const stores: AvailableVCStores[][] = [
    ['snap'],
    ['ceramic'],
    ['snap', 'ceramic'],
  ];

  beforeEach(async () => {
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

    // Clear stores before each test
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

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
    identifier = await agent.didManagerCreate({
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

  it.each(options)(
    'Should save VC in correct store - $title',
    async (store) => {
      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: generatedVC,
            options: store.options as SaveVCOptions,
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw new Error(saveRes.error);
      }

      expect(saveRes.data).toEqual([
        {
          id: expect.any(String),
          store: store.results,
        },
      ]);
      expect.assertions(1);
    }
  );

  it.each(options)(
    'Should save & query VC in correct store - $title',
    async (store) => {
      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: generatedVC,
            options: store.options as SaveVCOptions,
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw new Error(saveRes.error);
      }
      expect(saveRes.data).toEqual([
        {
          id: expect.any(String),
          store: store.results,
        },
      ]);

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

      const expectedResult = [
        {
          data: generatedVC,
          metadata: {
            id: saveRes.data[0].id,
            store: store.results,
          },
        },
      ];
      expect(res.data).toEqual(expectedResult);

      expect.assertions(2);
    }
  );

  it.each(stores)(
    'Should succeed saving a JWT string and retrieving whole VC - %s',
    async (store) => {
      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: generatedVC.proof.jwt,
            options: { store },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw new Error(saveRes.error);
      }
      expect(saveRes.data).toEqual([
        {
          id: expect.any(String),
          store: [store],
        },
      ]);

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
      // console.log("String JWT", res.data[0].data)
      const expectedResult = [
        {
          data: generatedVC,
          metadata: {
            id: saveRes.data[0].id,
            store: [store],
          },
        },
      ];
      expect(res.data).toEqual(expectedResult);

      expect.assertions(2);
    }
  );

  it('Should fail because store does not exist', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 'non-existent-store' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (!isError(saveRes)) {
      throw new Error('Should have failed');
    }
    expect(saveRes.error).toBe(
      'Error: Store non-existent-store is not enabled!'
    );
    expect.assertions(1);
  });

  it('should fail saving VC and return false - user denied', async () => {
    snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

    let res = (await onRpcRequest({
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
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe('Error: User rejected the request.');

    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

    res = (await onRpcRequest({
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

    expect.assertions(2);
  });

  it('should throw error because request is not valid', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          options: { store: 'snap' },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isSuccess(saveRes)) {
      throw new Error('Should return error');
    }

    expect(saveRes.error).toBe(
      'Error: invalid_argument: input.verifiableCredential'
    );

    expect.assertions(1);
  });

  it('should throw error because request is not valid: store format', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: 123 },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isSuccess(saveRes)) {
      throw new Error('Should return error');
    }

    expect(saveRes.error).toBe('Error: Store 123 is not enabled!');

    expect.assertions(1);
  });

  it('should throw error because request is not valid: store not supported in array', async () => {
    const saveRes = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveVC',
        params: {
          verifiableCredential: generatedVC,
          options: { store: ['snap', 'snapp'] },
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isSuccess(saveRes)) {
      throw new Error('Should return error');
    }

    expect(saveRes.error).toBe('Error: Store snapp is not enabled!');

    expect.assertions(1);
  });
});
