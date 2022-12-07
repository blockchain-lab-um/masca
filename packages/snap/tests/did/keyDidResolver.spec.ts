import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  address,
  exampleDIDKeyResolution,
  getDefaultSnapState,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import {
  getDidKeyResolver as resolveDidKey,
  resolveSecp256k1,
} from '../../src/did/key/keyDidResolver';
import {
  exampleDIDKey,
  exampleDIDKeyIdentifier,
  exampleDIDKeyDocument,
} from '../testUtils/constants';
import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';

describe('keyDidResolver', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.snap = snapMock;
  });

  describe('resolveDidKey', () => {
    it('should return correct did key resolution', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const didRes = await resolveDidKey().key(
        exampleDIDKeyIdentifier,
        {
          did: exampleDIDKey,
          method: 'key',
          didUrl: exampleDIDKeyIdentifier,
          id: '',
        },
        {
          resolve: function (
            didUrl: string,
            options?: DIDResolutionOptions | undefined
          ): Promise<DIDResolutionResult> {
            throw new Error('Function not implemented.');
          },
        },
        {}
      );
      expect(didRes.didDocument).toEqual(exampleDIDKeyDocument);
      expect.assertions(1);
    });
    it('should return proper DID Document', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const didRes = await resolveSecp256k1(
        snapMock,
        address,
        exampleDIDKeyIdentifier
      );

      expect(didRes).toEqual(exampleDIDKeyResolution.didDocument);
      expect.assertions(1);
    });
    it('should fail', async () => {
      const didRes = await resolveDidKey().key(
        '12345',
        {
          did: 'did:key:12345',
          method: 'key',
          didUrl: '12345',
          id: '',
        },
        {
          resolve: function (
            didUrl: string,
            options?: DIDResolutionOptions | undefined
          ): Promise<DIDResolutionResult> {
            throw new Error('Function not implemented.');
          },
        },
        {}
      );
      expect(didRes).toEqual({
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: 'invalidDid',
          message: 'unsupported key type for did:key',
        },
        didDocument: null,
      });
      expect.assertions(1);
    });
  });
});
