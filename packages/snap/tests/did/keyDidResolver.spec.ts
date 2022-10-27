import { SnapProvider } from '@metamask/snap-types';
import { getDefaultSnapState } from '../testUtils/constants';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import { getDidKeyResolver as resolveDidKey } from '../../src/did/key/keyDidResolver';
import {
  exampleDIDKey,
  exampleDIDKeyIdentifier,
  exampleDIDKeyDocument,
} from '../testUtils/constants';
describe('keyDidResolver', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
    walletMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.wallet = walletMock;
  });

  describe('resolveDidKey', () => {
    it('should return correct did key resolution', async () => {
      const didRes = await resolveDidKey().key(
        exampleDIDKeyIdentifier,
        {
          did: exampleDIDKey,
          method: 'key',
          didUrl: exampleDIDKeyIdentifier,
          id: '',
        },
        {},
        {}
      );
      expect(didRes.didDocument).toEqual(exampleDIDKeyDocument);
    });
    expect.assertions(1);
  });
});
