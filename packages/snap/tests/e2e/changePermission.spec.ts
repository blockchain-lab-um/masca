import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { type Result, isError, isSuccess } from '@blockchain-lab-um/utils';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import UIService from '../../src/UI.service';
import { getInitialPermissions } from '../../src/utils/config';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';

describe('changePermission', () => {
  let snapMock: SnapsProvider & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should show a popup when querying credentials', async () => {
    const spyQuery = vi.spyOn(snapMock.rpcMocks, 'snap_dialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.account.ssi.storesEnabled.ceramic = false;

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toStrictEqual([]);

    expect(spyQuery).toHaveBeenCalledTimes(1);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    const initialPermissions = getInitialPermissions();
    initialPermissions.methods.queryCredentials = true;

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions['random.io']
    ).toStrictEqual(initialPermissions);

    expect.assertions(3);
  });

  it('should not show popup if the dapp is already in the list', async () => {
    const spyQuery = vi.spyOn(snapMock.rpcMocks, 'snap_dialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.account.ssi.storesEnabled.ceramic = false;

    const initialPermissions2 = getInitialPermissions();
    initialPermissions2.methods.queryCredentials = true;

    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions['random.io'] =
      initialPermissions2;

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toStrictEqual([]);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    const initialPermissions3 = getInitialPermissions();
    initialPermissions3.methods.queryCredentials = true;

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions['random.io']
    ).toStrictEqual(initialPermissions3);

    expect(spyQuery).toHaveBeenCalledTimes(0);

    expect.assertions(3);
  });

  it('should change queryPermission to true & not show a popup when querying', async () => {
    const spyPermission = vi.spyOn(UIService, 'changePermissionDialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.account.ssi.storesEnabled.ceramic = false;

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res2 = (await onRpcRequest({
      origin: 'https://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'changePermission',
        params: {
          origin: 'random.io',
          method: 'queryCredentials',
          value: true,
        },
      },
    })) as Result<unknown>;

    if (isError(res2)) {
      throw new Error(res2.error);
    }

    expect(isSuccess(res2)).toBe(true);
    expect(spyPermission).toHaveBeenCalledTimes(1);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    const initialPermissions = getInitialPermissions();
    initialPermissions.methods.queryCredentials = true;

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions['random.io']
    ).toStrictEqual(initialPermissions);

    const spyQuery2 = vi.spyOn(snapMock.rpcMocks, 'snap_dialog');

    const res3 = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res3)) {
      throw new Error(res3.error);
    }

    expect(isSuccess(res3)).toBe(true);
    expect(spyQuery2).toHaveBeenCalledTimes(0);

    expect.assertions(5);
  });

  it('should change queryPermission to false & show a popup when querying', async () => {
    const spyPermission = vi.spyOn(UIService, 'changePermissionDialog');
    const spyQuery = vi.spyOn(snapMock.rpcMocks, 'snap_dialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.account.ssi.storesEnabled.ceramic = false;

    const initialPermissions3 = getInitialPermissions();
    initialPermissions3.methods.queryCredentials = true;

    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions['random.io'] =
      initialPermissions3;

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toStrictEqual([]);

    expect(spyQuery).toHaveBeenCalledTimes(0);

    const stateOld = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    const initialPermissions = getInitialPermissions();
    initialPermissions.methods.queryCredentials = true;

    expect(
      stateOld[CURRENT_STATE_VERSION].config.dApp.permissions['random.io']
    ).toStrictEqual(initialPermissions);

    const res2 = (await onRpcRequest({
      origin: 'https://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'changePermission',
        params: {
          origin: 'random.io',
          method: 'queryCredentials',
          value: false,
        },
      },
    })) as Result<unknown>;

    if (isError(res2)) {
      throw new Error(res2.error);
    }

    expect(isSuccess(res2)).toBe(true);
    expect(spyPermission).toHaveBeenCalledTimes(1);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    const initialPermissions2 = getInitialPermissions();
    initialPermissions2.methods.queryCredentials = false;

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions['random.io']
    ).toStrictEqual(initialPermissions2);

    const spyQuery2 = vi.spyOn(snapMock.rpcMocks, 'snap_dialog');

    const res3 = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryCredentials',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res3)) {
      throw new Error(res3.error);
    }

    expect(isSuccess(res3)).toBe(true);
    expect(spyQuery2).toHaveBeenCalledTimes(1);

    expect.assertions(8);
  });

  it('should fail changing queryPermission on another dApp', async () => {
    const defaultState = getDefaultSnapState(account);

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'https://random.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'changePermission',
        params: {
          origin: 'random2.io',
          method: 'queryCredentials',
          value: false,
        },
      },
    })) as Result<unknown>;

    expect(isSuccess(res)).toBe(false);
    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions['random2.io']
    ).toStrictEqual(undefined);

    expect.assertions(2);
  });
});
