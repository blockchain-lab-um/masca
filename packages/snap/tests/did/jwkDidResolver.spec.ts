import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';
import {
  address,
  getDefaultSnapState,
  exampleDIDJwk,
  exampleDIDJwkResolution,
  exampleDIDJwkIdentifier,
  exampleDIDJwkDocument,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import {
  getDidJwkResolver as resolveDidJwk,
  resolveSecp256k1,
} from '../../src/did/jwk/jwkDidResolver';
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
      expect(didRes.didDocument).toEqual(exampleDIDJwkDocument);
      expect.assertions(1);
    });
    it('should return proper DID Document', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const didRes = await resolveSecp256k1(
        snapMock,
        address,
        exampleDIDJwkIdentifier
      );

      expect(didRes).toEqual(exampleDIDJwkResolution.didDocument);
      expect.assertions(1);
    });
    it('should fail', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const didRes = await resolveDidJwk().jwk(
        '12345',
        {
          did: 'did:jwk:12345',
          method: 'key',
          didUrl: '12345',
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
          message: 'Error: Invalid DID',
        },
        didDocument: null,
      });
      expect.assertions(1);
    });
  });
});
