import {
  QueryVCsRequestResult,
  availableMethods,
  availableVCStores,
} from '@blockchain-lab-um/ssi-snap-types';
import { Result, isError, isSuccess } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-vc-manager';
import { StreamID } from '@ceramicnetwork/streamid';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  DIDResolutionResult,
  IIdentifier,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';

import { onRpcRequest } from '../../src';
import { StoredCredentials } from '../../src/interfaces';
import { veramoClearVCs } from '../../src/utils/veramoUtils';
import { Agent, getAgent } from '../../src/veramo/setup';
import {
  address,
  exampleDID,
  exampleDIDDocument,
  exampleDIDKey,
  exampleTestKey,
  exampleTestVCPayload,
  getDefaultSnapState,
  jsonPath,
} from '../testUtils/constants';
import { createTestVCs } from '../testUtils/generateTestVCs';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

jest.mock('uuid');

describe('onRpcRequest', () => {
  let ceramicData: StoredCredentials;
  let snapMock: SnapsGlobalObject & SnapMock;
  let identifier: IIdentifier;
  let agent: Agent;
  let exampleVeramoVCJWT: VerifiableCredential;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
    const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    agent = await getAgent(snapMock, ethereumMock);
    identifier = await agent.didManagerCreate({
      provider: 'did:ethr',
      kms: 'snap',
    });
    await agent.keyManagerImport(exampleTestKey);
    ({ exampleVeramoVCJWT } = await createTestVCs(
      {
        agent,
        proofFormat: 'jwt',
        payload: {
          issuer: identifier.did,
          ...exampleTestVCPayload,
        },
      },
      {
        keyRef: 'importedTestKey',
      }
    ));

    // Ceramic mock
    DIDDataStore.prototype.get = jest
      .fn()
      // eslint-disable-next-line @typescript-eslint/require-await
      .mockImplementation(async (_key, _did) => {
        return ceramicData;
      });

    DIDDataStore.prototype.merge = jest
      .fn()
      // eslint-disable-next-line @typescript-eslint/require-await
      .mockImplementation(async (_key, content, _options?) => {
        ceramicData = content as StoredCredentials;
        return 'ok' as unknown as StreamID;
      });
  });

  describe('saveVC', () => {
    it('should succeed saving 1 VC and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
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
          method: 'queryVCs',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
          metadata: {
            id: saveRes.data[0].id,
            store: ['snap'],
          },
        },
      ];

      expect(res.data).toEqual(expectedResult);

      expect.assertions(2);
    });

    it('should succeed saving 1 VC without store param and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
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
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
          metadata: {
            id: saveRes.data[0].id,
            store: ['snap'],
          },
        },
      ];

      expect(res.data).toEqual(expectedResult);

      expect.assertions(2);
    });

    it('should succeed saving 1 VC in Snap & Ceramic', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(),
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: 'ceramic',
      });

      snapMock.rpcMocks.snap_manageState({
        operation: 'clear',
      });

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: ['snap', 'ceramic'] },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      expect(saveRes.data).toEqual([
        {
          id: expect.any(String),
          store: expect.arrayContaining(['snap', 'ceramic']),
        },
      ]);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
          metadata: {
            id: saveRes.data[0].id,
            store: expect.arrayContaining(['snap', 'ceramic']),
          },
        },
      ];

      expect(res.data).toEqual(expectedResult);

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: 'ceramic',
      });

      expect.assertions(2);
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
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('User rejected the request.');

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([]);

      expect.assertions(2);
    });

    it('should return error because store is not supported', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snapp' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isSuccess(saveRes)) {
        throw new Error('Should return error');
      }

      expect(saveRes.error.message).toBe('Store snapp is not supported!');

      expect.assertions(1);
    });

    it('should throw error because request is not valid', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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

      expect(saveRes.error.message).toBe('Invalid SaveVC request');

      expect.assertions(1);
    });

    it('should throw error because request is not valid: store format', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 123 },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isSuccess(saveRes)) {
        throw new Error('Should return error');
      }

      expect(saveRes.error.message).toBe('Store is invalid format');

      expect.assertions(1);
    });
    it('should throw error because request is not valid: store not supported in array', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: ['snap', 'snapp'] },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isSuccess(saveRes)) {
        throw new Error('Should return error');
      }

      expect(saveRes.error.message).toBe('Store snapp is not supported!');

      saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: [] },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isSuccess(saveRes)) {
        throw new Error('Should return error');
      }

      expect(saveRes.error.message).toBe('Store is invalid format');

      expect.assertions(2);
    });
  });

  describe('queryVCs', () => {
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
        throw res.error;
      }

      expect(res.data).toEqual([]);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - filter by ID', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
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
        throw res.error;
      }

      expect(res.data).toEqual(expectedResult);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - no filter or store', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
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
        throw res.error;
      }

      expect(res.data).toEqual(expectedResult);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - store defined', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
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
        throw res.error;
      }

      expect(res.data).toEqual(expectedResult);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - without store', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
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
        throw res.error;
      }

      expect(res.data).toEqual(expectedResult);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - filter by JSONPath', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const expectedResult = [
        {
          data: exampleVeramoVCJWT,
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
              filter: jsonPath,
            },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(expectedResult);

      expect.assertions(1);
    });
  });

  describe('deleteVC', () => {
    it('should succeed saving and deleting 1 VC', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
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
          method: 'deleteVC',
          params: {
            id: saveRes.data[0].id,
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([true]);
      const result = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(result)) {
        throw result.error;
      }

      expect(result.data).toHaveLength(0);

      expect.assertions(3);
    });

    it('should succeed saving and deleting 1 VC with store', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
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
          method: 'deleteVC',
          params: {
            id: saveRes.data[0].id,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([true]);

      const result = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(result)) {
        throw result.error;
      }

      expect(result.data).toHaveLength(0);

      expect.assertions(3);
    });
    it('should fail deleting 1 VC with wrong id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
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
          method: 'deleteVC',
          params: {
            id: 'wrong_id',
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toHaveLength(0);

      const result = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      })) as Result<unknown>;

      if (isError(result)) {
        throw result.error;
      }

      expect(result.data).toHaveLength(1);

      expect.assertions(3);
    });
  });

  describe('createVP', () => {
    it('should succeed creating VP', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const VPRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: saveRes.data[0].id, metadata: { store: 'snap' } }],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (isError(VPRes)) {
        throw VPRes.error;
      }

      const createdVP = VPRes.data;

      expect(createdVP).not.toBeNull();

      // const verifyResult = (await agent.verifyPresentation({
      //   presentation: createdVP,
      // })) as IVerifyResult;

      // expect(verifyResult.verified).toBe(true);

      expect.assertions(1);
    });
    it('should succeed creating VP with did:key', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);
      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: { didMethod: 'did:key' },
        },
      });

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: saveRes.data[0].id }],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (isError(res)) {
        throw res.error;
      }

      const createdVP = res.data;

      expect(createdVP).not.toBeNull();

      // const verifyResult = (await agent.verifyPresentation({
      //   presentation: createdVP,
      // })) as IVerifyResult;

      // expect(verifyResult.verified).toBe(true);

      expect.assertions(1);
    });

    it('should fail creating VP - VC does not exist', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: 'test-id' }],
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('VC does not exist');

      expect.assertions(1);
    });
  });

  describe('togglePopups', () => {
    it('should succeed toggling popups and return true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'togglePopups',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBe(true);

      expect.assertions(1);
    });

    it('should fail toggling popups', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'togglePopups',
          params: {},
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('User rejected disabling popups');

      expect.assertions(1);
    });
  });

  describe('getDID', () => {
    it('should succeed returning current did (did:ethr)', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getDID',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(exampleDID);

      expect.assertions(1);
    });

    it('should succeed returning current did (did:key)', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:key',
          },
        },
      });

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getDID',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(exampleDIDKey);

      expect.assertions(1);
    });
  });

  describe('switchDIDMethod', () => {
    it('should succeed switching method to did:key and return did', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:key',
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBe(
        'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik'
      );

      expect.assertions(1);
    });

    it('should fail switching method to did:key', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:key',
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('User rejected method switch');

      expect.assertions(1);
    });

    it('should fail switching method because method is not supported', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:keyy',
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Did method is not supported!');

      expect.assertions(1);
    });

    it('should fail switching method because request is bad', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {},
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Invalid switchDIDMethod request.');

      expect.assertions(1);
    });
  });

  describe('getSelectedMethod', () => {
    it('should succeed and return did:ethr', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSelectedMethod',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBe('did:ethr');

      expect.assertions(1);
    });

    it('should succeed and return did:key', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:key',
          },
        },
      });

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSelectedMethod',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBe('did:key');

      expect.assertions(1);
    });
  });

  describe('getAvailableMethods', () => {
    it('should succeed and return available methods', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAvailableMethods',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(availableMethods);

      expect.assertions(1);
    });
  });

  describe('setVCStore', () => {
    it('should throw and error when using wrong vcStore', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramicc', value: true },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Store ceramicc is not supported!');

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramic', value: 'tlo' },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Invalid setVCStore request.');

      expect.assertions(2);
    });

    it('should succeed toggling ceramic store to true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramic', value: true },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBe(true);

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVCStore',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual({ ceramic: true, snap: true });

      expect.assertions(2);
    });
  });

  describe('getVCStore', () => {
    it('should succeed and return snap', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVCStore',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual({ ceramic: true, snap: true });

      expect.assertions(1);
    });
  });

  describe('getAvailableVCStores', () => {
    it('should succeed and return available VC stores', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAvailableVCStores',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(availableVCStores);

      expect.assertions(1);
    });
  });

  describe('getAccountSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return account settings', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAccountSettings',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(state.accountState[address].accountConfig);

      expect.assertions(1);
    });
  });

  describe('getSnapSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return snap settings', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSnapSettings',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual(state.snapConfig);

      expect.assertions(1);
    });
  });

  describe('resolveDID', () => {
    it('should succeed resolving did:ethr', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'resolveDID',
          params: { did: exampleDID },
        },
      })) as Result<DIDResolutionResult>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data.didDocument).toEqual(exampleDIDDocument);
      expect.assertions(1);
    });
  });

  describe('verifyCredential', () => {
    it('should succeed verifiying a VC', async () => {
      const verified = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'verifyData',
          params: {
            credential: exampleVeramoVCJWT,
          },
        },
      })) as Result<boolean>;

      if (isError(verified)) {
        throw verified.error;
      }

      expect(verified.data).toBe(true);
      expect.assertions(1);
    });

    it('should succeed verifying a VP', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const saveRes = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVeramoVCJWT,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(saveRes)) {
        throw saveRes.error;
      }

      const createdVP = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: saveRes.data[0].id, metadata: { store: 'snap' } }],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (isError(createdVP)) {
        throw createdVP.error;
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
        throw verified.error;
      }

      expect(verified.data).toBe(true);
      expect.assertions(1);
    });
  });

  describe('createVC', () => {
    it('should succeed creating a VC', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVC',
          params: {
            minimalUnsignedCredential: exampleTestVCPayload,
          },
        },
      })) as Result<VerifiableCredential>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toContainKey('proof');
      expect.assertions(1);
    });
    it('should succeed creating a JWT VC', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVC',
          params: {
            minimalUnsignedCredential: exampleTestVCPayload,
            proofFormat: 'jwt',
          },
        },
      })) as Result<VerifiableCredential>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toContainKey('proof');
      expect(res.data.proof.type).toBe('JwtProof2020');
      expect.assertions(2);
    });

    it('should succeed creating a EIP VC', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVC',
          params: {
            minimalUnsignedCredential: exampleTestVCPayload,
            proofFormat: 'EthereumEip712Signature2021',
          },
        },
      })) as Result<VerifiableCredential>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toContainKey('proof');
      expect(res.data.proof.type).toBe('EthereumEip712Signature2021');
      expect.assertions(2);
    });

    it.todo('should succeed creating a JSON-LD VC');

    it.todo('should fail creating an EIP VC - invalid VC');

    it('should succeed creating and saving a JWT VC', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVC',
          params: {
            minimalUnsignedCredential: exampleTestVCPayload,
            proofFormat: 'jwt',
            options: {
              save: true,
            },
          },
        },
      })) as Result<VerifiableCredential>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toContainKey('proof');
      expect(res.data.proof.type).toBe('JwtProof2020');

      const resQuery = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {},
        },
      })) as Result<QueryVCsRequestResult[]>;

      if (isError(resQuery)) {
        throw resQuery.error;
      }
      expect(resQuery.data).toHaveLength(1);
      expect(resQuery.data[0].data).toEqual(res.data);

      expect.assertions(4);
    });
  });
});
