import { getDidJwkIdentifier } from '../../src/did/jwk/jwkDidUtils';
import {
  address,
  exampleDIDJwkIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('jwkDidUtils', () => {
  beforeEach(() => {});

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
