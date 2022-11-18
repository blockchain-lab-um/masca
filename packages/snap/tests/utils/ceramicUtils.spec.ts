import { SnapsGlobalObject } from '@metamask/snaps-types';
import { snapMock, createMocksnap } from '../testUtils/snap.mock';
import { exampleVC, getDefaultSnapState } from '../testUtils/constants';
import { veramoListVCs, veramoSaveVC } from '../../src/utils/veramoUtils';
import { clear } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import { VerifiableCredential } from '@veramo/core';
describe('Utils [ceramic]', () => {
  let snapMock: SnapsGlobalObject & snapMock;

  beforeEach(() => {
    snapMock = createMocksnap();
  });

  describe('ceramicVCStore', () => {
    it('should clear all VCs stored on ceramic', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      await clear(snapMock);
      const vcs = await veramoListVCs(snapMock, 'ceramic');
      expect(vcs).toEqual([]);

      expect.assertions(1);
    });
    it('should succeed saving VC on ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await expect(veramoSaveVC(snapMock, exampleVC, 'ceramic')).resolves.toBe(
        true
      );

      expect.assertions(1);
    });
    it('should fail saving wrong object on ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await expect(
        veramoSaveVC(
          snapMock,
          { name: 'Alfredo' } as unknown as VerifiableCredential,
          'ceramic'
        )
      ).rejects.toThrow(
        `HTTP request to 'https://ceramic-clay.3boxlabs.com/api/v0/commits' failed with status 'Internal Server Error': {"error":"Validation Error: data/storedCredentials/1 must have required property '@context', data/storedCredentials/1 must have required property 'credentialSubject', data/storedCredentials/1 must have required property 'issuanceDate', data/storedCredentials/1 must have required property 'issuer', data/storedCredentials/1 must have required property 'proof'"}`
      );
    });
    it('should succeed retrieving VC from ceramic network', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const expectedVC = { ...exampleVC };
      const vcs = await veramoListVCs(snapMock, 'ceramic');
      vcs.map((vc) => {
        delete vc['key'];
        return vc;
      });
      expect(vcs).toEqual([expectedVC]);

      expect.assertions(1);
    });
  });
});
