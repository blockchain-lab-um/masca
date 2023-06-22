// TODO Revisit after composeDB is implemented
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { W3CVerifiableCredential } from '@veramo/core';

import {
  veramoClearVCs,
  veramoDeleteVC,
  veramoQueryVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import * as exampleVC from '../data/verifiable-credentials/exampleJWT.json';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Utils [ceramic]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;

    await veramoClearVCs({
      snap: snapMock,
      ethereum: ethereumMock,
      store: 'ceramic',
    });
  });

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    global.snap = snapMock;
    global.ethereum = ethereumMock;
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });

    // FIXME: this test is failing
    it.skip('should succeed saving VC on ceramic network', async () => {
      const expectedVCObject = { id: 'test-id', store: 'ceramic' };

      const ids = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      expectedVCObject.id = ids[0].id;
      expect(ids).toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should fail saving wrong object on ceramic network', async () => {
      await expect(
        veramoSaveVC({
          snap: snapMock,
          ethereum: ethereumMock,
          verifiableCredential: 123 as unknown as W3CVerifiableCredential,
          store: ['ceramic'],
        })
      ).resolves.toEqual([]);
    });

    // FIXME: this test is failing
    it.skip('should succeed retrieving VC from ceramic network', async () => {
      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: ['ceramic'] },
      };
      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expectedVCObject.metadata.id = vcs[0].metadata.id;
      expect(vcs).toEqual([expectedVCObject]);

      expect.assertions(2);
    });

    // FIXME: this test is failing
    it.skip('should succeed deleting VC from ceramic network', async () => {
      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      const ids = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      const vcsPreDelete = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(1);
      await veramoDeleteVC({
        id: ids[0].id,
        store: ['ceramic'],
        snap: snapMock,
        ethereum: ethereumMock,
      });
      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(0);

      expect.assertions(2);
    });

    // FIXME: this test is failing
    it.skip('should succeed storing and querying JWT from ceramic network', async () => {
      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVC);

      expect.assertions(2);
    });
  });
});
