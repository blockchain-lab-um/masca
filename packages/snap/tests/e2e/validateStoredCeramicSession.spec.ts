import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('validateStoredCeramicSession', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should return true for valid session', async () => {
    const defaultState = getDefaultSnapState(account);
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'validateStoredCeramicSession',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(true);

    expect.assertions(1);
  });

  it('should fail setting and invalid session string', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState.accountState[account].ceramicSession = 'invalid-session';
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'validateStoredCeramicSession',
        params: {},
      },
    })) as Result<unknown>;

    if (!isError(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toEqual('SyntaxError: Unexpected end of data');

    expect.assertions(1);
  });

  it.todo('Set expired session and return false');
});
