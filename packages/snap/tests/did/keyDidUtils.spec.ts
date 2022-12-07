import { SnapsGlobalObject } from '@metamask/snaps-types';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';
import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('keyDidUtils', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('keyDidUtils', () => {
    it('should generate proper DID', () => {
      const initialState = getDefaultSnapState();

      expect(getDidKeyIdentifier(initialState, address)).toEqual(
        exampleDIDKeyIdentifier
      );
      expect.assertions(1);
    });
  });
});
