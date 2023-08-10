import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('GoogleService', () => {
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

  describe('success', () => {
    it('valid session', async () => {
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
          method: 'setGoogleToken',
          params: {
            accessToken:
              'ya29.a0AfB_byAXj5oYoJeah5-MEUFhBaSPES4wh3ZBHFrHYtemmi0JGvZOYKbbwcEsdxc3GvRudPoCu3_LK7O-as9aJ8uLltgCXIPW3a4QtViDicFJgRGgF-dWGc-hOsL9Gg_W9wl4YjWYt9Ozg3q4X4-VmFxepSJEJAaCgYKAesSARASFQHsvYls_qEsnRkROky-d0KC0CpEJg0165',
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toBe(true);
    });
  });
  describe('failure', () => {
    it('null', async () => {
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
          method: 'setGoogleToken',
          params: {
            accessToken: null,
          },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toBe(true);
    });
  });
});
