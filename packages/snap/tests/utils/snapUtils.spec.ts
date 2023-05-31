import { getCompressedPublicKey } from '@blockchain-lab-um/utils';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import {
  addFriendlyDapp,
  getCurrentAccount,
  getCurrentNetwork,
  getPublicKey,
  removeFriendlyDapp,
  snapConfirm,
  togglePopups,
} from '../../src/utils/snapUtils';
import * as snapUtils from '../../src/utils/snapUtils';
import {
  address,
  bip44Entropy,
  compressedPublicKey,
  content,
  getDefaultSnapState,
  publicKey,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

describe('Utils [snap]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(),
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('getCurrentAccount', () => {
    it('should succeed and return test account', () => {
      const state = getDefaultSnapState();
      expect(getCurrentAccount(state)).toBe(address);

      expect.assertions(1);
    });
  });

  describe('getCurrentNetwork', () => {
    it('should succeed for mainnet (0x1)', async () => {
      snapMock.rpcMocks.eth_chainId.mockResolvedValue('0x5');

      await expect(getCurrentNetwork(ethereumMock)).resolves.toBe('0x5');

      expect.assertions(1);
    });

    it('should succeed for goerli (0x5)', async () => {
      snapMock.rpcMocks.eth_chainId.mockResolvedValue('0x5');

      await expect(getCurrentNetwork(ethereumMock)).resolves.toBe('0x5');

      expect.assertions(1);
    });
  });

  describe('togglePopups', () => {
    it('should succeed and toggle popups (off -> on)', async () => {
      const initialState = getDefaultSnapState();

      await expect(togglePopups(snapMock, initialState)).resolves.not.toThrow();

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = true;
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it('should succeed and toggle popups (on -> off)', async () => {
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.disablePopups = true;

      await expect(togglePopups(snapMock, initialState)).resolves.not.toThrow();

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = false;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });
  });

  describe('addFriendlyDapp', () => {
    it('should succeed adding dApp when friendlyDapps empty', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();

      await expect(
        addFriendlyDapp(snapMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [dApp];

      // Call should be `update` with the correct arguments
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it('should succeed adding dApp when friendlyDapps not empty', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: initialState,
      });

      await expect(
        addFriendlyDapp(snapMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
        dApp,
      ];

      // Call should be `update` with the correct arguments
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });
  });

  describe('removeFriendlyDapp', () => {
    it('should succeed removing dApp when there is only one', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [dApp];

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: initialState,
      });

      await expect(
        removeFriendlyDapp(snapMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();

      // Call should be `update` with the correct arguments
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it('should succeed removing dApp when there are many', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        dApp,
        'test_dApp_2',
        'test_dApp_3',
      ];

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: initialState,
      });

      await expect(
        removeFriendlyDapp(snapMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      // Call should be `update` with the correct arguments
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });
  });

  describe('getPublicKey', () => {
    it('should succeed getting public key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].publicKey = '';

      await expect(
        getPublicKey({
          snap: snapMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.toEqual(publicKey);

      expect.assertions(1);
    });

    it('should succeed getting public key (saved in snap state)', async () => {
      const initialState = getDefaultSnapState();

      await expect(
        getPublicKey({
          snap: snapMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.toEqual(publicKey);

      expect.assertions(1);
    });
  });

  describe('getCompressedPublicKey', () => {
    it('should generate correct compressed public key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].publicKey = '';
      const pk = await getPublicKey({
        snap: snapMock,
        state: initialState,
        account: address,
        bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
      });
      const compressedPK = getCompressedPublicKey(pk);

      expect(compressedPK).toEqual(compressedPublicKey);
    });
  });

  describe('snapConfirm', () => {
    it('should return true', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);

      await expect(snapConfirm(snapMock, content)).resolves.toBe(true);
      expect(snapMock.rpcMocks.snap_dialog).toHaveBeenCalledWith({
        content: {
          children: [
            { type: 'heading', value: 'Title of the panel' },
            { type: 'text', value: 'Text of the panel' },
          ],
          type: 'panel',
        },
        type: 'confirmation',
      });
    });
    it('should return false', async () => {
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(false);

      await expect(snapConfirm(snapMock, content)).resolves.toBe(false);
      expect(snapMock.rpcMocks.snap_dialog).toHaveBeenCalledWith({
        content: {
          children: [
            { type: 'heading', value: 'Title of the panel' },
            { type: 'text', value: 'Text of the panel' },
          ],
          type: 'panel',
        },
        type: 'confirmation',
      });
      expect.assertions(2);
    });
  });

  describe('getEnabledVCStores', () => {
    it('should return ceramic & snap', () => {
      const state = getDefaultSnapState();

      expect(snapUtils.getEnabledVCStores(address, state)).toEqual([
        'snap',
        'ceramic',
      ]);

      expect.assertions(1);
    });

    it('should return ceramic & snap (when both are passed)', () => {
      const state = getDefaultSnapState();

      expect(
        snapUtils.getEnabledVCStores(address, state, ['snap', 'ceramic'])
      ).toEqual(['snap', 'ceramic']);

      expect.assertions(1);
    });

    it('should return snap', () => {
      const state = getDefaultSnapState();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(snapUtils.getEnabledVCStores(address, state)).toEqual(['snap']);

      expect.assertions(1);
    });
    it('should return snap (when ceramic is passed aswell)', () => {
      const state = getDefaultSnapState();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(
        snapUtils.getEnabledVCStores(address, state, ['snap', 'ceramic'])
      ).toEqual(['snap']);

      expect.assertions(1);
    });
  });
});
