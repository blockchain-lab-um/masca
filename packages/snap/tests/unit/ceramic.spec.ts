// TODO Revisit after composeDB is implemented
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { W3CVerifiableCredential } from '@veramo/core';

import VeramoService from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import exampleVC from '../data/verifiable-credentials/exampleJWT.json';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Utils [ceramic]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });

    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await VeramoService.init();

    await VeramoService.clearCredentials({
      store: 'ceramic',
    });
  });

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
  });

  describe('ceramicVCStore', () => {
    it.skip('should clear all VCs stored on ceramic', async () => {
      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });

    // FIXME: this test is failing
    it.skip('should succeed saving VC on ceramic network', async () => {
      const expectedVCObject = { id: 'test-id', store: 'ceramic' };

      const ids = await VeramoService.saveCredential({
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      expectedVCObject.id = ids[0].id;
      expect(ids).toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should fail saving wrong object on ceramic network', async () => {
      await expect(
        VeramoService.saveCredential({
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
      const vcs = await VeramoService.queryCredentials({
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expectedVCObject.metadata.id = vcs[0].metadata.id;
      expect(vcs).toEqual([expectedVCObject]);

      expect.assertions(2);
    });

    // FIXME: this test is failing
    it.skip('should succeed deleting VC from ceramic network', async () => {
      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      const ids = await VeramoService.saveCredential({
        verifiableCredential: exampleVC,
        store: ['ceramic'],
      });
      const vcsPreDelete = await VeramoService.queryCredentials({
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(1);
      await VeramoService.deleteCredential({
        id: ids[0].id,
        store: ['ceramic'],
      });
      const vcs = await VeramoService.queryCredentials({
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(0);

      expect.assertions(2);
    });

    // FIXME: this test is failing
    it.skip('should succeed storing and querying JWT from ceramic network', async () => {
      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      await VeramoService.saveCredential({
        verifiableCredential: exampleVC.proof.jwt,
        store: ['ceramic'],
      });

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['ceramic'], returnStore: true },
      });
      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVC);

      expect.assertions(2);
    });
  });
});
