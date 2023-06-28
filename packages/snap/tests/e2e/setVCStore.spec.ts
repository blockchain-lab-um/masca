import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('setVCStore', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should throw and error when using wrong vcStore', async () => {
    let res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setVCStore',
        params: { store: 'ceramicc', value: true },
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe('Error: Store ceramicc is not supported!');

    res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setVCStore',
        params: { store: 'ceramic', value: 'tlo' },
      },
    })) as Result<unknown>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe('Error: Invalid setVCStore request.');

    expect.assertions(2);
  });

  it('should succeed toggling ceramic store to true', async () => {
    let res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setVCStore',
        params: { store: 'ceramic', value: true },
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);

    res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getVCStore',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual({ ceramic: true, snap: true });

    expect.assertions(2);
  });
});
