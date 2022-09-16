import { SnapProvider } from '@metamask/snap-types';
import {
  _hexToUnit8Array,
  _uint8ArrayToHex,
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
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  publicKey,
  getDefaultSnapState,
  infuraToken,
  snapConfirmParams,
} from '../testUtils/constants';
import { init } from '../../src/rpc/snap/init';
import cloneDeep from 'lodash.clonedeep';

describe('Utils [snap]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('getCurrentAccount', () => {
    it('should succeed and return test account', async () => {
      await expect(getCurrentAccount(walletMock)).resolves.toEqual(address);
    });

    it('should catch error and return null (user rejection)', async () => {
      walletMock.rpcMocks.eth_requestAccounts.mockRejectedValue(new Error());

      await expect(getCurrentAccount(walletMock)).resolves.toBeNull();
    });
  });

  describe('getCurrentNetwork', () => {
    it('should succeed for mainnet (0x1)', async () => {
      walletMock.rpcMocks.eth_chainId.mockResolvedValue('0x1');

      await expect(getCurrentNetwork(walletMock)).resolves.toEqual('0x1');

      expect(walletMock.rpcMocks.eth_chainId).toHaveBeenCalledTimes(1);
    });

    it('should succeed for rinkeby (0x4)', async () => {
      walletMock.rpcMocks.eth_chainId.mockResolvedValue('0x4');

      await expect(getCurrentNetwork(walletMock)).resolves.toEqual('0x4');

      expect(walletMock.rpcMocks.eth_chainId).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateInfuraToken', () => {
    it('should succeed with valid infura token', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        updateInfuraToken(walletMock, initialState, infuraToken)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.snap.infuraToken = infuraToken;

      // Call should be `update` with the correct arguments
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
  });

  describe('togglePopups', () => {
    it('should succeed and toggle popups (off -> on)', async () => {
      const initialState = getDefaultSnapState();

      await expect(
        togglePopups(walletMock, initialState)
      ).resolves.not.toThrow();

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = true;
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
    });

    it('should succeed and toggle popups (on -> off)', async () => {
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.disablePopups = true;

      await expect(
        togglePopups(walletMock, initialState)
      ).resolves.not.toThrow();

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = false;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
    });
  });

  describe('addFriendlyDapp', () => {
    it('should succeed adding dApp when friendlyDapps empty', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();

      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        addFriendlyDapp(walletMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [dApp];

      // Call should be `update` with the correct arguments
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
    });

    it('should succeed adding dApp when friendlyDapps not empty', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        addFriendlyDapp(walletMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
        dApp,
      ];

      // Call should be `update` with the correct arguments
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
    });
  });

  describe('removeFriendlyDapp', () => {
    it('should succeed removing dApp when there is only one', async () => {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [dApp];

      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        removeFriendlyDapp(walletMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();

      // Call should be `update` with the correct arguments
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
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

      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        removeFriendlyDapp(walletMock, initialState, dApp)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      // Call should be `update` with the correct arguments
      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
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

  //     walletMock.rpcMocks.snap_manageState.onCall(0).mockResolvedValue(initialState);

  //     await expect(getFriendlyDapps(walletMock)).to.eventually.be.deep.equal([
  //       'test_dApp_1',
  //       'test_dApp_2',
  //       'test_dApp_3',
  //     ]);
  //   });
  // });

  describe('getPublicKey', () => {
    it('should succeed getting public key', async () => {
      // FIXME: Reduce to 2 calls
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(getPublicKey(walletMock, address)).resolves.toEqual(
        publicKey
      );

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].publicKey = publicKey;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );
    });

    it('should succeed getting public key (saved in snap state)', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].publicKey = publicKey;
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(getPublicKey(walletMock, address)).resolves.toEqual(
        publicKey
      );
    });

    it('should fail getting private key (user denied)', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);
      walletMock.rpcMocks.personal_sign.mockRejectedValue(new Error());

      await expect(getPublicKey(walletMock, address)).rejects.toEqual(
        new Error('User denied request')
      );
    });
  });

  describe('getCompressedPublicKey', () => {
    it('TODO', () => {
      // TODO
    });
  });

  describe('snapConfirm', () => {
    it('should return true', async () => {
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);

      await expect(snapConfirm(walletMock, snapConfirmParams)).resolves.toEqual(
        true
      );

      expect(walletMock.rpcMocks.snap_confirm).toHaveBeenCalledWith(
        snapConfirmParams
      );
    });

    it('should return false', async () => {
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(false);

      await expect(snapConfirm(walletMock, snapConfirmParams)).resolves.toEqual(
        false
      );

      expect(walletMock.rpcMocks.snap_confirm).toHaveBeenCalledWith(
        snapConfirmParams
      );
    });
  });
});
