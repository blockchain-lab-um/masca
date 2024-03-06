import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import UIService from '../../src/UI.service';
import { getInitialPermissions } from '../../src/utils/config';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('addTrustedDapp', () => {
  let snapMock: SnapsProvider & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should make localhost trusted', async () => {
    const defaultState = getDefaultSnapState(account);
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'https://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addTrustedDapp',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toStrictEqual({ ...getInitialPermissions(), trusted: true });

    expect.assertions(2);
  });

  it('should make random-different a trusted dapp, because origin and params.origin are different', async () => {
    const defaultState = getDefaultSnapState(account);
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://random-different.com',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addTrustedDapp',
        params: { origin: 'random.com' },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        'random-different.com'
      ]
    ).toStrictEqual({ ...getInitialPermissions(), trusted: true });

    expect.assertions(2);
  });

  it('should fail because params are empty', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost = {
      ...getInitialPermissions(),
      trusted: true,
    };
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://localhost:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addTrustedDapp',
        params: {},
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should fail');
    }

    expect(res.error).toBe('Error: No origin provided.');

    expect.assertions(1);
  });

  it('Should not show popup if the dapp is already in the list', async () => {
    const spy = vi.spyOn(UIService, 'addTrustedDappDialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost2 = {
      ...getInitialPermissions(),
      trusted: true,
    };
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    await onRpcRequest({
      origin: 'http://localhost2:8081',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    });

    expect(spy).toHaveBeenCalledTimes(0);
    expect.assertions(1);
  });
});
