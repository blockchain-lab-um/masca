import { SnapsGlobalObject } from '@metamask/snaps-types';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';
import { getDidJwkIdentifier } from '../../src/did/jwk/jwkDidUtils';
import {
  address,
  exampleDIDJwkIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('jwkDidUtils', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('keyDidUtils', () => {
    it('should generate proper DID', () => {
      const initialState = getDefaultSnapState();

      expect(getDidJwkIdentifier(initialState, address)).toEqual(
        exampleDIDJwkIdentifier
      );
      expect.assertions(1);
    });
  });
});
