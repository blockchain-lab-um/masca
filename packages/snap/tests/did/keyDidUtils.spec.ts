import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('keyDidUtils', () => {
  it('getDidKeyIdentifier', () => {
    const initialState = getDefaultSnapState();

    expect(getDidKeyIdentifier(initialState, address)).toEqual(
      exampleDIDKeyIdentifier
    );
  });
});
