import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  exampleDID,
  exampleImportedDIDWIthoutPrivateKey,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import {
  changeCurrentMethod,
  changeCurrentVCStore,
  getCurrentDid,
} from '../../src/utils/didUtils';
import {
  veramoCreateVP,
  veramoImportMetaMaskAccount,
  veramoListVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { getAgent } from '../../src/veramo/setup';
import { VerifiablePresentation } from '@veramo/core';
import { clear } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
describe('Utils [ceramic]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    jest.setTimeout(60000);
    walletMock = createMockWallet();
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      await expect(clear(walletMock)).resolves.not.toThrow();
      const vcs = await veramoListVCs(walletMock, 'ceramic');
      expect(vcs).toEqual([]);

      expect.assertions(2);
    });
    it('should succeed saving VC on ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(
        veramoSaveVC(walletMock, exampleVC, 'ceramic')
      ).resolves.toBe(true);
    });
    it('should succeed retrieving VC from ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedVC = { ...exampleVC };
      const vcs = await veramoListVCs(walletMock, 'ceramic');
      vcs.map((vc) => {
        delete vc['key'];
        return vc;
      });
      expect(vcs).toEqual([expectedVC]);

      expect.assertions(1);
    });
  });
});
