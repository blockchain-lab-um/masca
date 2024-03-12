import {
  CURRENT_STATE_VERSION,
  MascaLegacyStateV1,
} from '@blockchain-lab-um/masca-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import StorageService from '../../src/storage/Storage.service';
import { getInitialSnapState } from '../../src/utils/config';
import { SnapMock, createMockSnap } from '../helpers/snapMock';
import * as MigrateState from '../../src/utils/stateMigration';

describe('Storage Service', () => {
  let snapMock: SnapsProvider & SnapMock;
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
describe('State Migration', () => {
  let snapMock: SnapsProvider & SnapMock;
  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'clear',
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should not migrate state from latest version', async () => {
    const spy = vi.spyOn(MigrateState, 'migrateToV2');
    const state = getInitialSnapState();
    StorageService.set(state);

    await StorageService.save();

    const newState = StorageService.get();

    expect(newState).toHaveProperty('v2');

    StorageService.init();
    await StorageService.save();

    const newState2 = StorageService.get();
    expect(newState2).toHaveProperty('v2');
    expect(spy).toHaveBeenCalledTimes(0);

    expect.assertions(3);
  });

  it('should succeed migrating state from v1 to v2', async () => {
    const spy = vi.spyOn(MigrateState, 'migrateToV2');
    let state: any = getInitialSnapState();
    state = { v1: state.v2 };
    state.v1.config.dApp.friendlyDapps = ['masca.io'];
    state.v1.config.dApp.permissions = undefined;
    const legacyStateV1: MascaLegacyStateV1 = state;
    StorageService.set(legacyStateV1 as any);

    await StorageService.save();

    const newState = StorageService.get();

    expect(newState).toHaveProperty('v1');

    StorageService.init();
    await StorageService.save();

    const newState2 = StorageService.get();
    expect(newState2).toHaveProperty('v2');
    expect(spy).toHaveBeenCalled();

    expect.assertions(3);
  });
});
