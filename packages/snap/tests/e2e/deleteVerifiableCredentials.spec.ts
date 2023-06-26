  import { isError, Result } from '@blockchain-lab-um/utils';
  import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
  import { DIDDataStore } from '@glazed/did-datastore';
  import { MetaMaskInpageProvider } from '@metamask/providers';
  import type {  SnapsGlobalObject } from '@metamask/snaps-types';
  import type { IIdentifier, VerifiableCredential } from '@veramo/core';
  
  import { onRpcRequest } from '../../src';
  import type { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
  import { getAgent, type Agent } from '../../src/veramo/setup';
  import { account, importablePrivateKey } from '../data/constants';
  import examplePayload from '../data/credentials/examplePayload.json';
  import { getDefaultSnapState } from '../data/defaultSnapState';
  import { createTestVCs } from '../helpers/generateTestVCs';
  import { createMockSnap, SnapMock } from '../helpers/snapMock';
  
  describe('Delete Verifiable Credentials', () => {
    let ceramicData: StoredCredentials;
    let snapMock: SnapsGlobalObject & SnapMock;
    let identifier: IIdentifier;
    let agent: Agent;
    let generatedVC: VerifiableCredential;
 
    beforeEach(async () => {
      snapMock = createMockSnap();
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(account),
      });
      global.snap = snapMock;
      const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
      agent = await getAgent(snapMock, ethereumMock);
      await agent.clear({ options: { store: ['snap', 'ceramic'] } });
      global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
    });
  
    beforeAll(async () => {
      snapMock = createMockSnap();
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(account),
      });
      const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
      agent = await getAgent(snapMock, ethereumMock);
      identifier = await agent.didManagerCreate({
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
  
    it('should succeed saving and deleting 1 VC', async () => {
        snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
  
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
          throw new Error(res.error);
        }
  
        expect(res.data).toEqual([true, false]);
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
          throw new Error(result.error);
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
            method: 'deleteVC',
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
            method: 'queryVCs',
            params: {
              query: {},
            },
          },
        })) as Result<unknown>;
  
        if (isError(result)) {
          throw new Error(result.error);
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
            method: 'deleteVC',
            params: {
              id: 'wrong_id',
              options: { store: 'snap' },
            },
          },
        })) as Result<unknown>;
  
        if (isError(res)) {
          throw new Error(res.error);
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
          throw new Error(result.error);
        }
  
        expect(result.data).toHaveLength(1);
  
        expect.assertions(3);
      });
  });
  