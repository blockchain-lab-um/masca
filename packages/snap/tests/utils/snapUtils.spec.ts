import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  addFriendlyDapp,
  getCompressedPublicKey,
  getCurrentAccount,
  getCurrentNetwork,
  getPublicKey,
  removeFriendlyDapp,
  snapConfirm,
  togglePopups,
  updateInfuraToken,
} from '../../src/utils/snapUtils';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import {
  address,
  publicKey,
  getDefaultSnapState,
  infuraToken,
  snapConfirmParams,
  bip44Entropy,
  compressedPublicKey,
} from '../testUtils/constants';
import { BIP44CoinTypeNode } from '@metamask/key-tree';

import * as snapUtils from '../../src/utils/snapUtils';

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

describe('Utils [snap]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('getCurrentAccount', () => {
    it('should succeed and return test account', async () => {
      await expect(getCurrentAccount(snapMock)).resolves.toEqual(address);

      expect.assertions(1);
    });
  });

  describe('getCurrentNetwork', () => {
    it('should succeed for mainnet (0x1)', async () => {
      snapMock.rpcMocks.eth_chainId.mockResolvedValue('0x5');

      await expect(getCurrentNetwork(snapMock)).resolves.toEqual('0x5');

      expect.assertions(1);
    });

    it('should succeed for goerli (0x5)', async () => {
      snapMock.rpcMocks.eth_chainId.mockResolvedValue('0x5');

      await expect(getCurrentNetwork(snapMock)).resolves.toEqual('0x5');

      expect.assertions(1);
    });
  });

  describe('updateInfuraToken', () => {
    it('should succeed with valid infura token', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        updateInfuraToken(snapMock, initialState, infuraToken)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.snap.infuraToken = infuraToken;

      // Call should be `update` with the correct arguments
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
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

      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

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

      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

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

      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

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

      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

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

  // describe('getFriendlyDapps', function () {
  //   it('should succeed getting friendly dApps', async function () {
  //     const initialState = getDefaultSnapState();
  //     initialState.ssiSnapState.snapConfig.dApp.friendlyDapps = [
  //       'test_dApp_1',
  //       'test_dApp_2',
  //       'test_dApp_3',
  //     ];

  //     snapMock.rpcMocks.snap_manageState
  //       .onCall(0)
  //       .mockResolvedValue(initialState);

  //     await expect(getFriendlyDapps(snapMock)).to.eventually.be.deep.equal([
  //       'test_dApp_1',
  //       'test_dApp_2',
  //       'test_dApp_3',
  //     ]);
  //   });
  // });

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
    // it('should return true', async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
    //   await expect(snapConfirm(snapMock, snapConfirmParams)).resolves.toEqual(
    //     true
    //   );
    //   expect(snapMock.rpcMocks.snap_dialog).toHaveBeenCalledWith({
    //     fields: {
    //       description: 'Test description',
    //       textAreaContent: 'Test text area content',
    //       title: 'Test prompt',
    //     },
    //     type: 'Confirmation',
    //   });
    //   expect.assertions(2);
    // });
    // it('should return false', async () => {
    //   snapMock.rpcMocks.snap_dialog.mockResolvedValue(false);
    //   await expect(snapConfirm(snapMock, snapConfirmParams)).resolves.toEqual(
    //     false
    //   );
    //   expect(snapMock.rpcMocks.snap_dialog).toHaveBeenCalledWith({
    //     fields: {
    //       description: 'Test description',
    //       textAreaContent: 'Test text area content',
    //       title: 'Test prompt',
    //     },
    //     type: 'Confirmation',
    //   });
    //   expect.assertions(2);
    // });
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
