import { SnapsGlobalObject } from '@metamask/snaps-types';
import { createMocksnap, snapMock } from '../testUtils/snap.mock';
import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('keyDidUtils', () => {
  let snapMock: SnapsGlobalObject & snapMock;

  beforeEach(() => {
    snapMock = createMocksnap();
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
