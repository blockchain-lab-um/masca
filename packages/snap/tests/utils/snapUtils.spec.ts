import { SnapProvider } from '@metamask/snap-types';
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
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
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

describe('Utils [snap]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('getCurrentAccount', () => {
    it('should succeed and return test account', async () => {
      await expect(getCurrentAccount(walletMock)).resolves.toEqual(address);

      expect.assertions(1);
    });

    it('should catch error and return null (user rejection)', async () => {
      walletMock.rpcMocks.eth_requestAccounts.mockRejectedValue(new Error());

      await expect(getCurrentAccount(walletMock)).resolves.toBeNull();

      expect.assertions(1);
    });
  });

  describe('getCurrentNetwork', () => {
    it('should succeed for mainnet (0x1)', async () => {
      walletMock.rpcMocks.eth_chainId.mockResolvedValue('0x1');

      await expect(getCurrentNetwork(walletMock)).resolves.toEqual('0x1');

      expect(walletMock.rpcMocks.eth_chainId).toHaveBeenCalledTimes(1);

      expect.assertions(2);
    });

    it('should succeed for goerli (0x5)', async () => {
      walletMock.rpcMocks.eth_chainId.mockResolvedValue('0x5');

      await expect(getCurrentNetwork(walletMock)).resolves.toEqual('0x5');

      expect(walletMock.rpcMocks.eth_chainId).toHaveBeenCalledTimes(1);

      expect.assertions(2);
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

      expect.assertions(2);
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

      expect.assertions(2);
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

      expect.assertions(2);
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

  //     walletMock.rpcMocks.snap_manageState
  //       .onCall(0)
  //       .mockResolvedValue(initialState);

  //     await expect(getFriendlyDapps(walletMock)).to.eventually.be.deep.equal([
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
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44Node: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.toEqual(publicKey);

      expect.assertions(1);
    });

    it('should succeed getting public key (saved in snap state)', async () => {
      const initialState = getDefaultSnapState();

      await expect(
        getPublicKey({
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44Node: bip44Entropy as BIP44CoinTypeNode,
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
        wallet: walletMock,
        state: initialState,
        account: address,
        bip44Node: bip44Entropy as BIP44CoinTypeNode,
      });
      const compressedPK = getCompressedPublicKey(pk);

      expect(compressedPK).toEqual(compressedPublicKey);
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

      expect.assertions(2);
    });

    it('should return false', async () => {
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(false);

      await expect(snapConfirm(walletMock, snapConfirmParams)).resolves.toEqual(
        false
      );

      expect(walletMock.rpcMocks.snap_confirm).toHaveBeenCalledWith(
        snapConfirmParams
      );

      expect.assertions(2);
    });
  });
});
