import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-datamanager';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { VerifiableCredential } from '@veramo/core';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import UIService from '../../src/UI.service';
import { getInitialPermissions } from '../../src/utils/config';
import VeramoService from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('removeTrustedDapp', () => {
  let snapMock: SnapsProvider & SnapMock;
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

    const agent = await VeramoService.createAgent();
    const identifier = await agent.didManagerCreate({
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

  it('should fail removing a different trustedDapp from the list (origin !== params.origin)', async () => {
    const resultAdd = (await onRpcRequest({
      origin: 'http://localhost:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addTrustedDapp',
        params: { origin: 'localhost' },
      },
    })) as Result<boolean>;

    if (isError(resultAdd)) {
      throw new Error(resultAdd.error);
    }

    expect(resultAdd.data).toBe(true);

    const resultRemove = (await onRpcRequest({
      origin: 'http://localhost2:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeTrustedDapp',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (!isError(resultRemove)) {
      throw new Error("Should've thrown an error");
    }

    expect(resultRemove.error).toBe(
      'Error: Unauthorized to remove other dApps'
    );

    expect.assertions(2);
  });

  it('should remove a trustedDapp from the list', async () => {
    const resultAdd = (await onRpcRequest({
      origin: 'https://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addTrustedDapp',
        params: { origin: 'localhost' },
      },
    })) as Result<boolean>;

    if (isError(resultAdd)) {
      throw new Error(resultAdd.error);
    }

    expect(resultAdd.data).toBe(true);

    const resultRemove = (await onRpcRequest({
      origin: 'http://localhost:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeTrustedDapp',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (isError(resultRemove)) {
      throw new Error(resultRemove.error);
    }

    expect(resultRemove.data).toBe(false);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toStrictEqual(getInitialPermissions());

    expect.assertions(3);
  });

  it('Should show popup if the dapp is not in the list', async () => {
    const spy = vi.spyOn(UIService, 'queryAllDialog');

    const defaultState = getDefaultSnapState(account);

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const saveRes = (await onRpcRequest({
      origin: 'http://localhost:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'saveCredential',
        params: {
          verifiableCredential: generatedVC,
          options: [],
        },
      },
    })) as Result<IDataManagerSaveResult[]>;

    if (isError(saveRes)) {
      throw new Error(saveRes.error);
    }

    (await onRpcRequest({
      origin: 'http://localhost2:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(spy).toHaveBeenCalledTimes(1);
    expect.assertions(1);
  });
});
