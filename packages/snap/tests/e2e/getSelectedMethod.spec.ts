import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('getSelectedMethod', () => {
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

  it('should succeed and return did:ethr', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getSelectedMethod',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe('did:ethr');

    expect.assertions(1);
  });

  it('should succeed and return did:key', async () => {
    await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: {
          didMethod: 'did:key',
        },
      },
    });

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getSelectedMethod',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe('did:key');

    expect.assertions(1);
  });
});
