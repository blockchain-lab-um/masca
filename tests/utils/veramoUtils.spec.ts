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

describe('Utils [veramo]', () => {
  let walletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('veramoGetId', () => {
    test('TODO', () => {
      //
    });
  });

  describe('veramoSaveVC', () => {
    it('TODO', () => {
      //
    });
  });

  describe('veramoListVCs', () => {
    it('TODO', () => {
      //
    });
  });

  describe('veramoImportMetaMaskAccount', () => {
    it('should succeed importing metamask account', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcStubs.snap_manageState.resolves(initialState);

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).to.eventually.be.fulfilled;
    });
  });
});
