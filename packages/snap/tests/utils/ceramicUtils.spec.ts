import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  exampleVC,
  exampleVCinVP,
  getDefaultSnapState,
} from '../testUtils/constants';
import {
  veramoClearVCs,
  veramoDeleteVC,
  veramoQueryVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { W3CVerifiableCredential } from '@veramo/core';

describe('Utils [ceramic]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeAll(async () => {
    walletMock = createMockWallet();
    walletMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    await veramoClearVCs({
      wallet: walletMock,
      store: 'ceramic',
    });
  });

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });
    it('should succeed saving VC on ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      const expectedVCObject = { id: 'test-id', store: 'ceramic' };

      const ids = await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      expectedVCObject.id = ids[0].id;
      expect(ids).toEqual([expectedVCObject]);

      expect.assertions(1);
    });
    it('should fail saving wrong object on ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const regex =
        /HTTP request to 'https:\/\/ceramic-clay.3boxlabs.com\/api\/v0\/commits' failed with status 'Internal Server Error': ([A-Za-z"':/0-9,-{}\\ ])+ /i;
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: 123 as unknown as W3CVerifiableCredential,
          store: ['ceramic'],
        })
      ).rejects.toThrow(regex);
    });
    it('should succeed retrieving VC from ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'ceramic' },
      };
      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expectedVCObject.metadata.id = vcs[0].metadata.id;
      expect(vcs).toEqual([expectedVCObject]);

      expect.assertions(2);
    });
    it('should succeed deleting VC from ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });

      const ids = await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      const vcsPreDelete = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(1);
      await veramoDeleteVC({
        id: ids[0].id,
        store: ['ceramic'],
        wallet: walletMock,
      });
      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(0);

      expect.assertions(2);
    });

    it('should succeed storing and querying JWT from ceramic network', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });

      const ids = await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVCinVP);

      expect.assertions(2);
    });
  });
});
