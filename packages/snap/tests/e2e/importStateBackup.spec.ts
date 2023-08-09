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

describe('importStateBackup', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let identifier: IIdentifier;
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

  it('Should suceed with default empty state', async () => {
    const startState: MascaState = cloneDeep(StorageService.get());
    const resExport = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'exportStateBackup',
        params: {},
      },
    })) as Result<string>;

    if (isError(resExport)) {
      throw new Error(resExport.error);
    }

    const resImport = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: resExport.data },
      },
    })) as Result<unknown>;

    if (isError(resImport)) {
      throw new Error(resImport.error);
    }

    expect(StorageService.get()).toEqual(startState);
    expect.assertions(1);
  });

  it('Should suceed with non-empty state (1 credential)', async () => {
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

    const startState: MascaState = cloneDeep(StorageService.get());
    const resExport = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'exportStateBackup',
        params: {},
      },
    })) as Result<string>;

    if (isError(resExport)) {
      throw new Error(resExport.error);
    }

    const resImport = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: resExport.data },
      },
    })) as Result<unknown>;

    if (isError(resImport)) {
      throw new Error(resImport.error);
    }
    expect(StorageService.get()).toEqual(startState);
    expect.assertions(2);
  });
});
