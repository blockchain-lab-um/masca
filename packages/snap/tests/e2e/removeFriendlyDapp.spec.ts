import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import UIService from '../../src/UI.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('removeFriendlyDapp', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should remove a friendlyDapp from the list', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState.snapConfig.dApp.friendlyDapps = ['localhost2'];
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'removeFriendlyDapp',
        params: { id: 'localhost2' },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    const state = await snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    });

    expect(state.snapConfig.dApp.friendlyDapps).toStrictEqual([]);

    expect.assertions(2);
  });

  it('Should show popup if the dapp is not in the list', async () => {
    const spy = jest.spyOn(UIService, 'queryAllDialog');

    const defaultState = getDefaultSnapState(account);
    await snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res2 = (await onRpcRequest({
      origin: 'localhost2',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'queryVCs',
        params: {},
      },
    })) as Result<unknown>;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(spy).toHaveBeenCalledTimes(1);
    expect.assertions(1);
  });
});
