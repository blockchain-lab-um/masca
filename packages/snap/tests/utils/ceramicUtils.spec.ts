import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import {
  address,
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
import * as snapUtils from '../../src/utils/snapUtils';

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

describe('Utils [ceramic]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(),
    });
    await veramoClearVCs({
      snap: snapMock,
      ethereum: snapMock as unknown as MetaMaskInpageProvider,
      store: 'ceramic',
    });
  });

  beforeEach(() => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    global.ethereum = snapMock;
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      await veramoClearVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });
    it('should succeed saving VC on ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const expectedVCObject = { id: 'test-id', store: 'ceramic' };

      const ids = await veramoSaveVC({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      expectedVCObject.id = ids[0].id;
      expect(ids).toEqual([expectedVCObject]);

      expect.assertions(1);
    });
    it('should fail saving wrong object on ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await expect(
        veramoSaveVC({
          snap: snapMock,
          ethereum: snapMock as unknown as MetaMaskInpageProvider,
          verifiableCredential: 123 as unknown as W3CVerifiableCredential,
          store: ['ceramic'],
        })
      ).resolves.toEqual([]);
    });
    it('should succeed retrieving VC from ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'ceramic' },
      };
      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expectedVCObject.metadata.id = vcs[0].metadata.id;
      expect(vcs).toEqual([expectedVCObject]);

      expect.assertions(2);
    });
    it('should succeed deleting VC from ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await veramoClearVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        store: ['ceramic'],
      });

      const ids = await veramoSaveVC({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      const vcsPreDelete = await veramoQueryVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(1);
      await veramoDeleteVC({
        id: ids[0].id,
        store: ['ceramic'],
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
      });
      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(0);

      expect.assertions(2);
    });

    it('should succeed storing and querying JWT from ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await veramoClearVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        store: ['ceramic'],
      });

      await veramoSaveVC({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: snapMock as unknown as MetaMaskInpageProvider,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVCinVP);

      expect.assertions(2);
    });
  });
});
