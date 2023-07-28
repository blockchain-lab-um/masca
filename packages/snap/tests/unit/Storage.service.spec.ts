// FIXME: Either update/rewrite this or

import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import StorageService from '../../src/storage/Storage.service';
import { getInitialSnapState } from '../../src/utils/config';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Storage Service', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'clear',
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('Should succeed initializing storage', async () => {
    await StorageService.init();

    const state = StorageService.get();

    expect(state).toBeDefined();
    expect(state).toEqual(getInitialSnapState());

    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'get',
    });

    expect.assertions(3);
  });

  it('should succeed turning on and saving disabled popups', async () => {
    await StorageService.init();

    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'get',
    });

    const state = StorageService.get();
    state.snapConfig.dApp.disablePopups = true;
    await StorageService.save();

    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'update',
      newState: state,
    });

    await StorageService.init();
    const newState = StorageService.get();

    expect(newState.snapConfig.dApp.disablePopups).toBe(true);
    expect.assertions(3);
  });
});
