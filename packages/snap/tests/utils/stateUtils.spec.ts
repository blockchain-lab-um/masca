import { getEmptyAccountState } from './../../src/utils/config';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';
import { getInitialSnapState } from '../../src/utils/config';
import {
  getSnapState,
  getSnapStateUnchecked,
  initAccountState,
  initSnapState,
  setAccountPublicKey,
  updateSnapState,
} from '../../src/utils/stateUtils';
import {
  address,
  bip44Entropy,
  getDefaultSnapState,
  publicKey,
} from '../testUtils/constants';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';

describe('Utils [state]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('updateSnapState', () => {
    it('should succeed updating snap state with default state', async () => {
      const initialState = getDefaultSnapState();

      await expect(
        updateSnapState(walletMock, initialState)
      ).resolves.not.toThrow();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        initialState
      );

      expect.assertions(2);
    });

    it('should succeed updating snap state with empty state', async () => {
      const emptyState = {};

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        updateSnapState(walletMock, emptyState as any)
      ).resolves.not.toThrow();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        emptyState
      );

      expect.assertions(2);
    });
  });

  describe('getSnapState', () => {
    it('should fail and throw not initialized error', async () => {
      await expect(getSnapState(walletMock)).rejects.toThrow(
        new Error('SSISnapState is not initialized!')
      );

      expect.assertions(1);
    });

    it('should succeed getting initial snap state', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValueOnce(initialState);

      await expect(getSnapState(walletMock)).resolves.toEqual(initialState);

      expect.assertions(1);
    });
  });

  describe('getSnapStateUnchecked', () => {
    it('should return null if state is not initialized', async () => {
      await expect(getSnapStateUnchecked(walletMock)).resolves.toEqual(null);

      expect.assertions(1);
    });

    it('should succeed getting initial snap state', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValueOnce(initialState);

      await expect(getSnapStateUnchecked(walletMock)).resolves.toEqual(
        initialState
      );

      expect.assertions(1);
    });
  });

  describe('initSnapState', () => {
    it('should succeed initializing snap state', async () => {
      const initialState = getInitialSnapState();

      await expect(initSnapState(walletMock)).resolves.toEqual(initialState);

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        initialState
      );

      expect.assertions(2);
    });
  });

  describe('initAccountState', () => {
    it('should succeed initializing empty account state', async () => {
      const initialState = getInitialSnapState();
      const defaultState = getDefaultSnapState();
      defaultState.accountState[address].publicKey = '';

      await expect(
        initAccountState({
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.not.toThrow();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        defaultState
      );

      expect.assertions(2);
    });
  });

  describe('setPublicKey', () => {
    it('should succeed setting public key', async () => {
      const initialState = getInitialSnapState();
      initialState.accountState[address] = getEmptyAccountState();
      const defaultState = getDefaultSnapState();
      defaultState.accountState[address].publicKey = publicKey;

      await expect(
        setAccountPublicKey({
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.not.toThrow();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        defaultState
      );

      expect.assertions(2);
    });
  });
});
