import {
  CURRENT_STATE_VERSION,
  MascaLegacyStateV1,
  type MascaState,
} from '@blockchain-lab-um/masca-types';
import { type Result, isError } from '@blockchain-lab-um/utils';
import type { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import type { IIdentifier, VerifiableCredential } from '@veramo/core';
import cloneDeep from 'lodash.clonedeep';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';
import {
  getEmptyAccountState,
  getInitialSnapState,
} from '../../src/utils/config';
import EncryptionService from '../../src/Encryption.service';
import {
  getLegacyEmptyAccountStateV1,
  getLegacyEmptyAccountStateV2,
  getLegacyStateV1,
  getLegacyStateV2,
} from '../data/legacyStates';
import { randomUUID } from 'node:crypto';

describe('importStateBackup', () => {
  let snapMock: SnapsProvider & SnapMock;
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

  it('Should suceed with v1 empty state', async () => {
    const spy = vi.spyOn(StorageService, 'migrateState');

    const legacyStateV1 = getLegacyStateV1();
    legacyStateV1.v1.accountState[account] = getLegacyEmptyAccountStateV1();
    legacyStateV1.v1.currentAccount = account;

    const encryptedState = await EncryptionService.encrypt(
      JSON.stringify(legacyStateV1)
    );

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: encryptedState },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }

    const expectedState = getInitialSnapState();
    expectedState[CURRENT_STATE_VERSION].accountState[account] =
      getEmptyAccountState();
    expectedState[CURRENT_STATE_VERSION].currentAccount = account;

    expect(spy).toHaveBeenCalled();
    expect(StorageService.get()).toEqual(expectedState);
    expect.assertions(2);
  });

  it('Should suceed with v1 non-empty state (1 credential)', async () => {
    const spy = vi.spyOn(StorageService, 'migrateState');

    const legacyStateV1 = getLegacyStateV1();
    const credentialId = randomUUID();
    legacyStateV1.v1.accountState[account] = getLegacyEmptyAccountStateV1();
    legacyStateV1.v1.currentAccount = account;
    legacyStateV1.v1.accountState[account].veramo.credentials = {
      [credentialId]: generatedVC,
    };

    const encryptedState = await EncryptionService.encrypt(
      JSON.stringify(legacyStateV1)
    );

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: encryptedState },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }

    const expectedState = getInitialSnapState();
    expectedState[CURRENT_STATE_VERSION].accountState[account] =
      getEmptyAccountState();
    expectedState[CURRENT_STATE_VERSION].currentAccount = account;
    expectedState[CURRENT_STATE_VERSION].accountState[
      account
    ].veramo.credentials = {
      [credentialId]: generatedVC,
    };

    expect(spy).toHaveBeenCalled();
    expect(StorageService.get()).toEqual(expectedState);
    expect.assertions(2);
  });

  it('Should suceed with v2 empty state', async () => {
    const spy = vi.spyOn(StorageService, 'migrateState');

    const legacyStateV2 = getLegacyStateV2();
    legacyStateV2.v2.accountState[account] = getLegacyEmptyAccountStateV2();
    legacyStateV2.v2.currentAccount = account;

    const encryptedState = await EncryptionService.encrypt(
      JSON.stringify(legacyStateV2)
    );

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: encryptedState },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }

    const expectedState = getInitialSnapState();
    expectedState[CURRENT_STATE_VERSION].accountState[account] =
      getEmptyAccountState();
    expectedState[CURRENT_STATE_VERSION].currentAccount = account;

    expect(spy).toHaveBeenCalled();
    expect(StorageService.get()).toEqual(expectedState);
    expect.assertions(2);
  });

  it('Should suceed with v2 non-empty state (1 credential)', async () => {
    const spy = vi.spyOn(StorageService, 'migrateState');

    const legacyStateV2 = getLegacyStateV2();
    const credentialId = randomUUID();
    legacyStateV2.v2.accountState[account] = getLegacyEmptyAccountStateV2();
    legacyStateV2.v2.currentAccount = account;
    legacyStateV2.v2.accountState[account].veramo.credentials = {
      [credentialId]: generatedVC,
    };

    const encryptedState = await EncryptionService.encrypt(
      JSON.stringify(legacyStateV2)
    );

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: encryptedState },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }

    const expectedState = getInitialSnapState();
    expectedState[CURRENT_STATE_VERSION].accountState[account] =
      getEmptyAccountState();
    expectedState[CURRENT_STATE_VERSION].currentAccount = account;
    expectedState[CURRENT_STATE_VERSION].accountState[
      account
    ].veramo.credentials = {
      [credentialId]: generatedVC,
    };

    expect(spy).toHaveBeenCalled();
    expect(StorageService.get()).toEqual(expectedState);
    expect.assertions(2);
  });

  it('Should suceed with default empty state', async () => {
    const startState: MascaState = cloneDeep(StorageService.get());
    const exportStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'exportStateBackup',
        params: {},
      },
    })) as Result<string>;

    if (isError(exportStateBackupResult)) {
      throw new Error(exportStateBackupResult.error);
    }

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: exportStateBackupResult.data },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }

    expect(StorageService.get()).toEqual(startState);
    expect.assertions(1);
  });

  it('Should suceed with non-empty state (1 credential)', async () => {
    const saveCredentialResult = (await onRpcRequest({
      origin: 'http://localhost',
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

    if (isError(saveCredentialResult)) {
      throw new Error(saveCredentialResult.error);
    }

    expect(saveCredentialResult.data).toEqual([
      {
        id: expect.any(String),
        store: ['snap'],
      },
    ]);

    const startState: MascaState = cloneDeep(StorageService.get());
    const exportStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'exportStateBackup',
        params: {},
      },
    })) as Result<string>;

    if (isError(exportStateBackupResult)) {
      throw new Error(exportStateBackupResult.error);
    }

    const importStateBackupResult = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'importStateBackup',
        params: { serializedState: exportStateBackupResult.data },
      },
    })) as Result<unknown>;

    if (isError(importStateBackupResult)) {
      throw new Error(importStateBackupResult.error);
    }
    expect(StorageService.get()).toEqual(startState);
    expect.assertions(2);
  });
});
