import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';
import {
  address,
  getDefaultSnapState,
  exampleDIDJwk,
  exampleDIDJwkResolution,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import { getDidJwkResolver as resolveDidJwk } from '../../src/did/jwk/jwkDidResolver';
import * as snapUtils from '../../src/utils/snapUtils';

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

describe('jwkDidResolver', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.snap = snapMock;
  });

  describe('resolveDidJwk', () => {
    it('should return correct did jwk resolution', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const didRes = await resolveDidJwk().jwk(
        exampleDIDJwk,
        {
          did: exampleDIDJwk,
          method: 'jwk',
          didUrl: `${exampleDIDJwk}#0`,
          id: '',
        },
        {
          resolve: (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            didUrl: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            options?: DIDResolutionOptions | undefined
          ): Promise<DIDResolutionResult> => {
            throw new Error('Function not implemented.');
          },
        },
        {}
      );
      expect(didRes).toEqual(exampleDIDJwkResolution);
      expect.assertions(1);
    });
    it('should fail', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const didRes = await resolveDidJwk().jwk(
        'did:jwk:eyJ0ZXN0IjoidGVzdCJ9',
        {
          did: 'did:jwk:eyJ0ZXN0IjoidGVzdCJ9',
          method: 'jwk',
          didUrl: 'eyJ0ZXN0IjoidGVzdCJ9#0',
          id: '',
        },
        {
          resolve: (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            didUrl: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            options?: DIDResolutionOptions | undefined
          ): Promise<DIDResolutionResult> => {
            throw new Error('Function not implemented.');
          },
        },
        {}
      );
      expect(didRes).toEqual({
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: 'invalidDid',
          message: 'Error: Invalid DID identifier',
        },
        didDocument: null,
      });
      expect.assertions(1);
    });
  });
});
