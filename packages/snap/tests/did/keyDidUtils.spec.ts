import { SnapProvider } from '@metamask/snap-types';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';
import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  getDefaultSnapState,
} from '../testUtils/constants';

describe('keyDidUtils', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
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
