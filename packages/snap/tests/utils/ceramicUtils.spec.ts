import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import { exampleVC, getDefaultSnapState } from '../testUtils/constants';
import { veramoListVCs, veramoSaveVC } from '../../src/utils/veramoUtils';
import { clear } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import { VerifiableCredential } from '@veramo/core';
describe('Utils [ceramic]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      await clear(walletMock);
      const vcs = await veramoListVCs(walletMock, ['ceramic']);
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });
    it('should succeed saving VC on ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(
        veramoSaveVC(walletMock, exampleVC, 'ceramic')
      ).resolves.toBe(true);

      expect.assertions(1);
    });
    it('should fail saving wrong object on ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(
        veramoSaveVC(
          walletMock,
          { name: 'Alfredo' } as unknown as VerifiableCredential,
          'ceramic'
        )
      ).rejects.toThrow(
        `HTTP request to 'https://ceramic-clay.3boxlabs.com/api/v0/commits' failed with status 'Internal Server Error': {"error":"Validation Error: data/storedCredentials/1 must have required property '@context', data/storedCredentials/1 must have required property 'credentialSubject', data/storedCredentials/1 must have required property 'issuanceDate', data/storedCredentials/1 must have required property 'issuer', data/storedCredentials/1 must have required property 'proof'"}`
      );
    });
    it('should succeed retrieving VC from ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedVC = { ...exampleVC };
      const vcs = await veramoListVCs(walletMock, ['ceramic']);
      vcs.map((vc) => {
        delete vc['key'];
        return vc;
      });
      expect(vcs).toEqual([expectedVC]);

      expect.assertions(1);
    });
  });
});
