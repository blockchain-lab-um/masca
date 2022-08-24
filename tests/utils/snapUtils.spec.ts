import { SnapProvider } from '@metamask/snap-types';
import { expect } from 'chai';
import {
  _hexToUnit8Array,
  _uint8ArrayToHex,
  addFriendlyDapp,
  getCompressedPublicKey,
  getCurrentAccount,
  getCurrentNetwork,
  getFriendlyDapps,
  getPublicKey,
  removeFriendlyDapp,
  snapConfirm,
  togglePopups,
  updateInfuraToken,
} from '../../src/utils/snapUtils';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  infuraToken1,
  infuraToken2,
  publicKey,
} from '../testUtils/constants';
import { init } from '../../src/rpc/snap/init';
import { getSnapConfig } from '../../src/utils/stateUtils';

describe('Utils [snap]', function () {
  let walletMock: SnapProvider & WalletMock;

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
      await expect(init(walletMock)).to.eventually.be.fulfilled;

      walletMock.resetHistory();
      await expect(updateInfuraToken(walletMock, infuraToken1)).to.eventually.be
        .fulfilled;

      //expect(walletMock.rpcStubs.snap_manageState).to.have.callCount(2);

      const snapConfig = await getSnapConfig(walletMock);

      expect(snapConfig.snap.infuraToken).to.deep.equal(infuraToken1);
    });

    it('should fail for null', function () {
      //
    });

    it('should fail for empty string', function () {
      //
    });
  });

  describe('removeFriendlyDapp', function () {
    it('', function () {
      //
    });
  });

  describe('getPublicKey', function () {
    it('', function () {
      //
    });
  });

  describe('getCompressedPublicKey', function () {
    it('', function () {
      //
    });
  });

  describe('snapConfirm', function () {
    it('', function () {
      //
    });
  });

  describe('togglePopups', function () {
    it('', function () {
      //
    });
  });
});
