// FIXME: Either update/rewrite this or

import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import StorageService from '../../src/storage/Storage.service';
import { getInitialSnapState } from '../../src/utils/config';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Storage Service', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'clear',
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    // Initialize storage before each test
    await StorageService.init();
  });

  it('Should succeed getting state from storage', async () => {
    const state = StorageService.get();

    expect(state).toEqual(getInitialSnapState());
    expect.assertions(1);
  });

  it('Should succeed getting current account state from storage', async () => {
    const initialSnapState = getInitialSnapState();

    const state = StorageService.getAccountState();

    expect(state).toStrictEqual(
      initialSnapState[CURRENT_STATE_VERSION].accountState[
        initialSnapState[CURRENT_STATE_VERSION].currentAccount
      ]
    );
    expect.assertions(1);
  });

  it('should succeed saving updated state to storage', async () => {
    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].config.dApp.disablePopups = true;

    await StorageService.save();

    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'update',
      newState: state,
    });

    const newState = StorageService.get();
    expect(newState[CURRENT_STATE_VERSION].config.dApp.disablePopups).toBe(
      true
    );
    expect.assertions(2);
  });
});
