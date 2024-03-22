import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import StorageService from '../../src/storage/Storage.service';
import { getInitialSnapState } from '../../src/utils/config';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';
import { getLegacyStateV1 } from '../data/legacyStates/legacyStateV1';

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

  it('should migrate state from v1 to latest version', async () => {
    const legacyStateV1 = getLegacyStateV1();

    const newState = StorageService.migrateState(
      structuredClone(legacyStateV1)
    );

    const expectedState = getInitialSnapState();

    expect(newState).toEqual(expectedState);

    expect.assertions(1);
  });

  it('should not migrate state from latest version', async () => {
    const state = getInitialSnapState();

    const newState = StorageService.migrateState(structuredClone(state));

    expect(newState).toEqual(state);

    expect.assertions(1);
  });

  it('should migrate state to latest version when init method is called', async () => {
    const spy = vi.spyOn(StorageService, 'migrateState');

    const legacyStateV1 = getLegacyStateV1();
    StorageService.set(legacyStateV1 as any);
    await StorageService.save();

    let state = StorageService.get();
    expect(state).toHaveProperty('v1');

    StorageService.init();
    await StorageService.save();

    state = StorageService.get();
    expect(state).toHaveProperty(CURRENT_STATE_VERSION);
    expect(spy).toHaveBeenCalledOnce();
    expect.assertions(3);
  });
});
