import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import { address, getDefaultSnapState } from '../testUtils/constants';
import { veramoImportMetaMaskAccount } from '../../src/utils/veramoUtils';

describe('Utils [veramo]', () => {
  let walletMock: SnapProvider & WalletMock;

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
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).resolves.not.toThrow();
    });
  });
});
