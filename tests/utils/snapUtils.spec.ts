import { SnapProvider } from '@metamask/snap-types';
import { expect } from 'chai';
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

describe('Utils [snap]', function () {
  // let walletMock: SnapProvider & WalletMock;

  beforeEach(function () {
    walletMock = createMockWallet();
  });

  describe('getCurrentAccount', function () {
    it('should succeed and return test account', async function () {
      await expect(getCurrentAccount(walletMock)).to.eventually.be.deep.equal(
        address
      );
    });

    it('should catch error and return null (user rejection)', async function () {
      walletMock.rpcStubs.eth_requestAccounts.rejects();

      await expect(getCurrentAccount(walletMock)).to.eventually.be.deep.equal(
        null
      );
    });
  });

  describe('getCurrentNetwork', function () {
    it('should succeed for mainnet (0x1)', async function () {
      walletMock.rpcStubs.eth_chainId.resolves('0x1');

      await expect(getCurrentNetwork(walletMock)).to.eventually.be.deep.equal(
        '0x1'
      );

      expect(walletMock.rpcStubs.eth_chainId).to.have.callCount(1);
    });

    it('should succeed for rinkeby (0x4)', async function () {
      walletMock.rpcStubs.eth_chainId.resolves('0x4');

      await expect(getCurrentNetwork(walletMock)).to.eventually.be.deep.equal(
        '0x4'
      );

      expect(walletMock.rpcStubs.eth_chainId).to.have.callCount(1);
    });
  });

  describe('updateInfuraToken', function () {
    it('should succeed with valid infura token', async function () {
      const initialState = getDefaultSnapState();
      walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

      await expect(updateInfuraToken(walletMock, initialState, infuraToken)).to
        .eventually.be.fulfilled;

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.snap.infuraToken = infuraToken;

      // Call should be `update` with the correct arguments
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;
      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });
  });

  describe('togglePopups', function () {
    it('should succeed and toggle popups (off -> on)', async function () {
      const initialState = getDefaultSnapState();

      await expect(togglePopups(walletMock, initialState)).to.eventually.be
        .fulfilled;

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = true;
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;

      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });

    it('should succeed and toggle popups (on -> off)', async function () {
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.disablePopups = true;

      await expect(togglePopups(walletMock, initialState)).to.eventually.be
        .fulfilled;

      // Call should be `update` with the correct arguments
      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.disablePopups = false;

      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;

      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });
  });

  describe('addFriendlyDapp', function () {
    it('should succeed adding dApp when friendlyDapps empty', async function () {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();

      walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

      await expect(addFriendlyDapp(walletMock, initialState, dApp)).to
        .eventually.be.fulfilled;

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [dApp];

      // Call should be `update` with the correct arguments
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;
      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });

    it('should succeed adding dApp when friendlyDapps not empty', async function () {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

      await expect(addFriendlyDapp(walletMock, initialState, dApp)).to
        .eventually.be.fulfilled;

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
        dApp,
      ];

      // Call should be `update` with the correct arguments
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;
      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });
  });

  describe('removeFriendlyDapp', function () {
    it('should succeed removing dApp when there is only one', async function () {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [dApp];

      walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

      await expect(removeFriendlyDapp(walletMock, initialState, dApp)).to
        .eventually.be.fulfilled;

      const expectedState = getDefaultSnapState();

      // Call should be `update` with the correct arguments
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;
      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });

    it('should succeed removing dApp when there are many', async function () {
      const dApp = 'test_dApp_42';
      const initialState = getDefaultSnapState();
      initialState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        dApp,
        'test_dApp_2',
        'test_dApp_3',
      ];

      walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

      await expect(removeFriendlyDapp(walletMock, initialState, dApp)).to
        .eventually.be.fulfilled;

      const expectedState = getDefaultSnapState();
      expectedState.snapConfig.dApp.friendlyDapps = [
        'test_dApp_1',
        'test_dApp_2',
        'test_dApp_3',
      ];

      // Second call should be `update` with the correct arguments
      const args = walletMock.rpcStubs.snap_manageState.getCall(0).args;
      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
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

  //     walletMock.rpcStubs.snap_manageState.onCall(0).resolves(initialState);

  //     await expect(getFriendlyDapps(walletMock)).to.eventually.be.deep.equal([
  //       'test_dApp_1',
  //       'test_dApp_2',
  //       'test_dApp_3',
  //     ]);
  //   });
  // });

  describe('getPublicKey', function () {
    it('should succeed getting public key', async function () {
      // FIXME: Reduce to 2 calls
      const initialState = getDefaultSnapState();
      walletMock.rpcStubs.snap_manageState.resolves(initialState);

      await expect(
        getPublicKey(walletMock, address)
      ).to.eventually.be.deep.equal(publicKey);

      // TODO: Maybe reset resolve or resolve only on first call to get ?
      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].publicKey = publicKey;

      const args = walletMock.rpcStubs.snap_manageState.getCall(3).args;

      expect(args.length).to.be.equal(2);
      expect(args[0]).to.be.equal('update');
      expect(args[1]).to.be.deep.equal(expectedState);
    });

    it('should succeed getting public key (saved in snap state)', async function () {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].publicKey = publicKey;
      walletMock.rpcStubs.snap_manageState.resolves(initialState);

      await expect(
        getPublicKey(walletMock, address)
      ).to.eventually.be.deep.equal(publicKey);
    });

    it('should fail getting private key (user denied)', async function () {
      const initialState = getDefaultSnapState();
      walletMock.rpcStubs.snap_manageState.resolves(initialState);
      walletMock.rpcStubs.personal_sign.rejects();

      await expect(
        getPublicKey(walletMock, address)
      ).to.eventually.be.rejectedWith('User denied request');
    });
  });

  describe('getCompressedPublicKey', function () {
    it('TODO', function () {
      // TODO
    });
  });

  describe('snapConfirm', function () {
    it('should return true', async function () {
      walletMock.rpcStubs.snap_confirm.resolves(true);

      await expect(
        snapConfirm(walletMock, snapConfirmParams)
      ).to.eventually.be.deep.equal(true);

      const args = walletMock.rpcStubs.snap_confirm.getCall(0).args;
      expect(args).to.be.deep.equal([snapConfirmParams]);
    });

    it('should return false', async function () {
      walletMock.rpcStubs.snap_confirm.resolves(false);

      await expect(
        snapConfirm(walletMock, snapConfirmParams)
      ).to.eventually.be.deep.equal(false);

      const args = walletMock.rpcStubs.snap_confirm.getCall(0).args;
      expect(args).to.be.deep.equal([snapConfirmParams]);
    });
  });
});
