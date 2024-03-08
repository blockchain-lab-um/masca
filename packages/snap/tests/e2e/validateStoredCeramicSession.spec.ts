import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { Result, isError } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { SnapMock, createMockSnap } from '../helpers/snapMock';

describe('validateStoredCeramicSession', () => {
  let snapMock: SnapsProvider & SnapMock;

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
      origin: 'http://localhost',
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

    expect(res.data).toBe(true);

    expect.assertions(1);
  });

  it('should fail setting and invalid session string', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState[CURRENT_STATE_VERSION].accountState[
      account
    ].general.ceramicSession = 'invalid-session';
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });
    const res = (await onRpcRequest({
      origin: 'http://localhost',
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

    expect(res.error).toBe('SyntaxError: Unexpected end of data');

    expect.assertions(1);
  });

  it.todo('Set expired session and return false');
});
