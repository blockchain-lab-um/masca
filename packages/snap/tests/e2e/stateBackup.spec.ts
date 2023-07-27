import { type MascaState } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { IIdentifier, VerifiableCredential } from '@veramo/core';
import cloneDeep from 'lodash.clonedeep';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account, importablePrivateKey } from '../data/constants';
import examplePayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('stateBackup', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let identifier: IIdentifier;
  let agent: Agent;
  let generatedVC: VerifiableCredential;
  let exportedState: string;

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
  });

  describe('exportStateBackup', () => {
    describe('success', () => {
      it('default state', async () => {
        const res = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'exportStateBackup',
            params: {},
          },
        })) as Result<unknown>;

        if (isError(res)) {
          throw new Error(res.error);
        }

        expect(JSON.parse(res.data as string)).toEqual(StorageService.get());
        expect(res.data).toBe(
          '{"accountState":{"0xb6665128eE91D84590f70c3268765384A9CAfBCd":{"polygonState":{"polygonid":{"eth":{"main":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"goerli":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"mumbai":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}}},"polygon":{"main":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"mumbai":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"goerli":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}}}},"iden3":{"eth":{"main":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"goerli":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"mumbai":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}}},"polygon":{"main":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"mumbai":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}},"goerli":{"credentials":{},"identities":{},"profiles":{},"merkleTreeMeta":[],"merkleTree":{}}}}},"vcs":{},"accountConfig":{"ssi":{"didMethod":"did:ethr","vcStore":{"snap":true,"ceramic":true}}},"ceramicSession":"eyJzZXNzaW9uS2V5U2VlZCI6IlJCcGVUK3poMmFpQ2xOTVBZYXllYUFSSVBhVkZUZ1pZVHU4M3I0dHBpR1U9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6Ik15Tm9kZUFwcCIsImlhdCI6IjIwMjMtMDYtMTVUMTI6Mjc6NTguNzgyWiIsImlzcyI6ImRpZDpwa2g6ZWlwMTU1OjE6MHhiNjY2NTEyOGVlOTFkODQ1OTBmNzBjMzI2ODc2NTM4NGE5Y2FmYmNkIiwiYXVkIjoiZGlkOmtleTp6Nk1rd1V6aW5FU2lGdWo2dlR1bk1kbVYyTWtvbm1ud3lkdlE4Rjlwc0xzQ0xyUW8iLCJ2ZXJzaW9uIjoiMSIsIm5vbmNlIjoiSnFKTTNZcFc5ayIsImV4cCI6IjIwMjUtMDYtMTRUMTI6Mjc6NTguNzgyWiIsInN0YXRlbWVudCI6IkdpdmUgdGhpcyBhcHBsaWNhdGlvbiBhY2Nlc3MgdG8gc29tZSBvZiB5b3VyIGRhdGEgb24gQ2VyYW1pYyIsInJlc291cmNlcyI6WyJjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjNmlkYWFjdzVkNGdjNDgxZW5wYmV1djRmYXQ2NmdqcTFrazlpdnRhbmFkc2UwNzQ2ZGwiXX0sInMiOnsidCI6ImVpcDE5MSIsInMiOiIweGNmZjk0YjgyZmVlODZmZmM0Zjg0ZjYxODFmMDRkNGY2NGY5ZmVmZTAyODgyNzg4Mzc1M2ZhNWFiYThiM2VkYWQ3NzdhZThjMGY3ZTQ0MTIzMzM2ZmQzNjIwNjA5MWE0NmM0MDYxZTQzZGY4OGVhYzdmZWI2ZTE2M2Y5Yzc2OWI3MWMifX19"}},"currentAccount":"0xb6665128eE91D84590f70c3268765384A9CAfBCd","snapConfig":{"dApp":{"disablePopups":false,"friendlyDapps":[]},"snap":{"acceptedTerms":true}}}'
        );
        expect.assertions(2);
      });
      it('filled state', async () => {
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
            method: 'exportStateBackup',
            params: {},
          },
        })) as Result<unknown>;

        if (isError(res)) {
          throw new Error(res.error);
        }

        expect(res.data).toEqual(expect.any(String));
      });
    });
  });
  describe('importStateBackup', () => {
    describe('success', () => {
      it('default state', async () => {
        const startState: MascaState = cloneDeep(StorageService.get());
        const resExport = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'exportStateBackup',
            params: {}
          },
        })) as Result<unknown>;
    
        if (isError(resExport)) {
          throw new Error(resExport.error);
        }

        const resImport = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'importStateBackup',
            params: { serializedState: resExport.data as string }
          },
        })) as Result<unknown>;
    
        if (isError(resImport)) {
          throw new Error(resImport.error);
        }
        expect(StorageService.get()).toEqual(startState);
      });
      it('filled state', async () => {
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

        const startState: MascaState = cloneDeep(StorageService.get());
        const resExport = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'exportStateBackup',
            params: {}
          },
        })) as Result<unknown>;
    
        if (isError(resExport)) {
          throw new Error(resExport.error);
        }

        const resImport = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'importStateBackup',
            params: { serializedState: resExport.data as string }
          },
        })) as Result<unknown>;
    
        if (isError(resImport)) {
          throw new Error(resImport.error);
        }
        expect(StorageService.get()).toEqual(startState);
      });
    });
  });
});
