import {
  availableMethods,
  availableVCStores,
} from '@blockchain-lab-um/ssi-snap-types';
import { Result, isError, isSuccess } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-vc-manager';
import { StreamID } from '@ceramicnetwork/streamid';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionResult, VerifiablePresentation } from '@veramo/core';
import * as uuid from 'uuid';

import { onRpcRequest } from '../../src';
import { StoredCredentials } from '../../src/interfaces';
import * as snapUtils from '../../src/utils/snapUtils';
import { veramoClearVCs } from '../../src/utils/veramoUtils';
import {
  address,
  exampleDID,
  exampleDIDDocument,
  exampleDIDKey,
  exampleVC,
  getDefaultSnapState,
  jsonPath,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

jest.mock('uuid');
let ceramicData: StoredCredentials;
jest
  .spyOn(DIDDataStore.prototype, 'get')
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  .mockImplementation(async (key, did?) => {
    return ceramicData;
  });
jest
  .spyOn(DIDDataStore.prototype, 'merge')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  .mockImplementation(async (key, content, options?) => {
    ceramicData = content as StoredCredentials;
    return 'ok' as unknown as StreamID;
  });

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

describe('onRpcRequest', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    // snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('saveVC', () => {
    it('should succeed saving 1 VC and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
      ]);

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
        throw res.error;
      }

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
            store: ['snap'],
          },
        },
      ];

      expect(res.data).toEqual(expectedResult);

      expect.assertions(2);
    });

    it('should succeed saving 1 VC without store param and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
      ]);

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

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: ['snap', 'ceramic'] },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'ceramic',
        },
      ]);

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

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
            store: ['snap', 'ceramic'],
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

    it.skip('should fail saving VC and return false - user denied', () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      //   await expect(
      //     onRpcRequest({
      //       origin: 'localhost',
      //       request: {
      //         id: 'test-id',
      //         jsonrpc: '2.0',
      //         method: 'saveVC',
      //         params: {
      //           verifiableCredential: exampleVC,
      //           options: { store: 'snap' },
      //         },
      //       },
      //     })
      //   ).rejects.toThrow('User rejected');

      //   await expect(
      //     onRpcRequest({
      //       origin: 'localhost',
      //       request: {
      //         id: 'test-id',
      //         jsonrpc: '2.0',
      //         method: 'queryVCs',
      //         params: {
      //           query: {},
      //         },
      //       },
      //     })
      //   ).resolves.toEqual([]);

      //   expect.assertions(2);
    });

    it('should return error because store is not supported', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snapp' },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Store snapp is not supported!');

      expect.assertions(1);
    });

    it('should throw error because request is not valid', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Invalid SaveVC request');

      expect.assertions(1);
    });

    it('should throw error because request is not valid: store format', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 123 },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Store is invalid format');

      expect.assertions(1);
    });
    it('should throw error because request is not valid: store not supported in array', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: ['snap', 'snapp'] },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Store snapp is not supported!');

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: [] },
          },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error.message).toBe('Store is invalid format');

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

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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
              filter:
                '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
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

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
      ]);

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'deleteVC',
          params: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([true]);

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

      expect(res.data).toHaveLength(0);

      expect.assertions(3);
    });

    it('should succeed saving and deleting 1 VC with store', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
      ]);

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'deleteVC',
          params: {
            id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([true]);

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

      expect(res.data).toHaveLength(0);

      expect.assertions(3);
    });

    it('should fail deleting 1 VC with wrong id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toEqual([
        {
          id: '76a8bd7568f458a444e9fb54d09be341cb70d4cc481a88442524fa7f9995b1a0',
          store: 'snap',
        },
      ]);

      res = (await onRpcRequest({
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

      expect(res.data).toHaveLength(1);

      expect.assertions(3);
    });
  });

  describe('createVP', () => {
    it('should succeed creating VP', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);
      let res;
      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(res)) {
        throw res.error;
      }

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: res.data[0].id, metadata: { store: 'snap' } }],
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
    it('should succeed creating VP with did:key', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);
      let res;
      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      })) as Result<IDataManagerSaveResult[]>;

      if (isError(res)) {
        throw res.error;
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

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: res.data[0].id }],
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

    it.skip('should fail creating VP and return null - user denied', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createVP',
            params: {
              vcs: [{ id: 'test-id' }],
            },
          },
        })
      ).rejects.toThrow('User rejected');

      expect.assertions(1);
    });

    it('should fail creating VP - VC does not exist', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      const res = (await onRpcRequest({
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

      if (isError(res)) {
        throw res.error;
      }

      expect(res.data).toBeNull();

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

    it.skip('should fail toggling popups and return false', () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      //   await expect(
      //     onRpcRequest({
      //       origin: 'localhost',
      //       request: {
      //         id: 'test-id',
      //         jsonrpc: '2.0',
      //         method: 'togglePopups',
      //         params: {},
      //       },
      //     })
      //   ).resolves.toBe(false);

      //   expect.assertions(1);
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
    it('should succeed switching method to did:key and return true', async () => {
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

    it.skip('should fail switching method to did:key and return false', () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      //   await expect(
      //     onRpcRequest({
      //       origin: 'localhost',
      //       request: {
      //         id: 'test-id',
      //         jsonrpc: '2.0',
      //         method: 'switchDIDMethod',
      //         params: {

      //           didMethod: 'did:key',
      //         },
      //       },
      //     })
      //   ).resolves.toBe('');

      //   expect.assertions(1);
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
});
