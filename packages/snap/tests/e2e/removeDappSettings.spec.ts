import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { Result, isError, isSuccess } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import { getInitialPermissions } from '../../src/utils/config';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { SnapMock, createMockSnap } from '../helpers/snapMock';

describe('removeDappSettings', () => {
  let snapMock: SnapsProvider & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should remove settings for localhost', async () => {
    const defaultState = getDefaultSnapState(account);

    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost =
      getInitialPermissions();

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toStrictEqual(getInitialPermissions());

    const res = (await onRpcRequest({
      origin: 'https://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    const state2 = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state2[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toBeUndefined();

    expect.assertions(3);
  });

  it('should throw an error because params are not a string', async () => {
    const defaultState = getDefaultSnapState(account);

    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost =
      getInitialPermissions();

    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
        params: { origin: 123 },
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should be an error');
    }

    expect(res.error).toBe('Error: invalid_argument: $input.origin');

    expect.assertions(1);
  });

  it('should throw an error because origin is missing', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost =
      getInitialPermissions();
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should be an error');
    }

    expect(res.error).toBe('Error: invalid_argument: $input');

    expect.assertions(1);
  });

  it('should throw an error because settings can only be changed on masca.io', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost =
      getInitialPermissions();
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://masca2.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should be an error');
    }

    expect(res.error).toBe('Unauthorized to change settings.');

    expect.assertions(1);
  });

  it('should not do anything if dapp settings do not exist', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.permissions.localhost =
      getInitialPermissions();
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'http://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toBeUndefined();

    const res2 = (await onRpcRequest({
      origin: 'http://masca.io',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeDappSettings',
        params: { origin: 'localhost' },
      },
    })) as Result<unknown>;

    if (isError(res2)) {
      throw new Error(res2.error);
    }

    const state2 = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(
      state2[CURRENT_STATE_VERSION].config.dApp.permissions.localhost
    ).toBeUndefined();

    expect.assertions(2);
  });
});
