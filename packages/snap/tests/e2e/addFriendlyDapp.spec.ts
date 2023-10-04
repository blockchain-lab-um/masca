import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import UIService from '../../src/UI.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('addFriendlyDapp', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should add a friendlyDapp to the list', async () => {
    const defaultState = getDefaultSnapState(account);
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'addFriendlyDapp',
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
      state[CURRENT_STATE_VERSION].config.dApp.friendlyDapps
    ).toStrictEqual(['localhost']);

    expect.assertions(2);
  });

  it('Should not show pop-up if the dapp is already in the list', async () => {
    const spy = vi.spyOn(UIService, 'addFriendlyDappDialog');

    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].config.dApp.friendlyDapps = [
      'localhost2',
    ];
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    await onRpcRequest({
      origin: 'localhost2',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {},
      },
    });

    expect(spy).toHaveBeenCalledTimes(0);
    expect.assertions(1);
  });
});
