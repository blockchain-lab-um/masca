import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { getAgent, type Agent } from '../../src/veramo/setup';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Helper Methods', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let agent: Agent;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    agent = await getAgent(snapMock, ethereumMock);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
  });

  beforeEach(async () => {
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

  describe('getAccountSettings', () => {
    const state = getDefaultSnapState(account);
    it('should succeed and return account settings', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAccountSettings',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      state.accountState[account].accountConfig.ssi.didMethod = 'did:key';

      expect(res.data).toEqual(state.accountState[account].accountConfig);

      expect.assertions(1);
    });
  });
});
