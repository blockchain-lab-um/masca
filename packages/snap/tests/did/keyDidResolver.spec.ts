import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';

import {
  getDidKeyResolver as resolveDidKey,
  resolveSecp256k1,
} from '../../src/did/key/keyDidResolver';
import {
  address,
  exampleDIDKey,
  exampleDIDKeyDocument,
  exampleDIDKeyIdentifier,
  exampleDIDKeyResolution,
  getDefaultSnapState,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

describe('keyDidResolver', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
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
          resolve(
            _didUrl: string,
            _options?: DIDResolutionOptions | undefined
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
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      const didRes = await resolveDidKey().key(
        '12345',
        {
          did: 'did:key:12345',
          method: 'key',
          didUrl: '12345',
          id: '',
        },
        {
          resolve(
            _didUrl: string,
            _options?: DIDResolutionOptions | undefined
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
