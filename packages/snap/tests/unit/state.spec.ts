import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import GeneralService from '../../src/General.service';
import { getInitialSnapState } from '../../src/utils/config';
import {
  getSnapState,
  getSnapStateUnchecked,
  updateSnapState,
} from '../../src/utils/stateUtils';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Utils [state]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });

    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('updateSnapState', () => {
    it('should succeed updating snap state with default state', async () => {
      const initialState = getDefaultSnapState(account);

      await expect(updateSnapState(initialState)).resolves.not.toThrow();

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: initialState,
      });

      expect.assertions(2);
    });

    it('should succeed updating snap state with empty state', async () => {
      const emptyState = {};

      await expect(updateSnapState(emptyState as any)).resolves.not.toThrow();

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: emptyState,
      });

      expect.assertions(2);
    });
  });

  describe('getSnapState', () => {
    it('should fail and throw not initialized error', async () => {
      snapMock.rpcMocks.snap_manageState({
        operation: 'clear',
      });

      await expect(getSnapState()).rejects.toThrow(
        new Error('MascaState is not initialized!')
      );

      expect.assertions(1);
    });

    it('should succeed getting initial snap state', async () => {
      const initialState = getDefaultSnapState(account);

      await expect(getSnapState()).resolves.toEqual(initialState);

      expect.assertions(1);
    });
  });

  describe('getSnapStateUnchecked', () => {
    it('should return null if state is not initialized', async () => {
      snapMock.rpcMocks.snap_manageState({
        operation: 'clear',
      });

      await expect(getSnapStateUnchecked()).resolves.toBeNull();

      expect.assertions(1);
    });

    it('should succeed getting initial snap state', async () => {
      const initialState = getDefaultSnapState(account);

      await expect(getSnapStateUnchecked()).resolves.toEqual(initialState);

      expect.assertions(1);
    });
  });

  describe('initSnapState', () => {
    it('should succeed initializing snap state', async () => {
      const initialState = getInitialSnapState();

      snapMock.rpcMocks.snap_manageState({
        operation: 'clear',
      });

      await GeneralService.initState();
      await expect(getSnapState()).resolves.toEqual(initialState);

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: initialState,
      });

      expect.assertions(2);
    });
  });

  describe('initAccountState', () => {
    it('should succeed initializing empty account state', async () => {
      const defaultState = getDefaultSnapState(account);
      delete defaultState.accountState[account].ceramicSession;

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: { ...getInitialSnapState(), currentAccount: account },
      });

      await GeneralService.initAccountState();

      const state = await getSnapState();

      expect(state).toEqual(defaultState);

      expect.assertions(1);
    });
  });
});
