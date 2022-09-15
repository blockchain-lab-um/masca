import { SnapProvider } from '@metamask/snap-types';
import chai from 'chai';
import { expect } from 'chai';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import { address, getDefaultSnapState } from '../testUtils/constants';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { veramoImportMetaMaskAccount } from '../../src/utils/veramoUtils';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Utils [veramo]', function () {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(function () {
    walletMock = createMockWallet();
  });

  describe('veramoGetId', function () {
    test('TODO', function () {
      //
    });
  });

  describe('veramoSaveVC', function () {
    it('TODO', function () {
      //
    });
  });

  describe('veramoListVCs', function () {
    it('TODO', function () {
      //
    });
  });

  describe('veramoImportMetaMaskAccount', function () {
    it('should succeed importing metamask account', async function () {
      const initialState = getDefaultSnapState();
      walletMock.rpcStubs.snap_manageState.resolves(initialState);

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).to.eventually.be.fulfilled;
    });
  });
});
