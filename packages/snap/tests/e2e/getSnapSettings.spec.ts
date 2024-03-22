import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { type Result, isError } from '@blockchain-lab-um/utils';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';

describe('getSnapSettings', () => {
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

  const state = getDefaultSnapState(account);
  it('should succeed and return snap settings', async () => {
    const res = (await onRpcRequest({
      origin: 'http://localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getSnapSettings',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toEqual(state[CURRENT_STATE_VERSION].config);

    expect.assertions(1);
  });
});
