import { SnapProvider } from '@metamask/snap-types';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';
import { resolveSecp256k1 } from '../../src/did/key/keyDidResolver';
import { getDidKeyIdentifier } from '../../src/did/key/keyDidUtils';
import {
  address,
  exampleDIDKeyIdentifier,
  exampleDIDKeyResolution,
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
    });
  });

  describe('keyDidResolver', () => {
    it('should return proper DID Document', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      const didRes = await resolveSecp256k1(
        walletMock,
        address,
        exampleDIDKeyIdentifier
      );

      expect(didRes).toEqual(exampleDIDKeyResolution.didDocument);
    });
  });
});
