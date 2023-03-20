import { SnapsGlobalObject } from '@metamask/snaps-types';

import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

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
