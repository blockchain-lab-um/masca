import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
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

  it('should add any trustedDapp to the list', async () => {
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
    ).toStrictEqual({ ...getInitialPermissions(), trustedDapp: true });

    expect.assertions(2);
  });

  it('should add origin trustedDapp to the list on a random dApp', async () => {
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
    ).toStrictEqual({ ...getInitialPermissions(), trustedDapp: true });

    expect.assertions(2);
  });

  it('should not add empty trustedDapp to the list', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost = {
      ...getInitialPermissions(),
      trustedDapp: true,
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

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toStrictEqual({ ...getInitialPermissions(), trustedDapp: true });

    expect.assertions(2);
  });

  it('Should not show pop-up if the dapp is already in the list', async () => {
    const spy = vi.spyOn(UIService, 'addTrustedDappDialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost2 = {
      ...getInitialPermissions(),
      trustedDapp: true,
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