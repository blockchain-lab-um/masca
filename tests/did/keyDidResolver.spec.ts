import { SnapProvider } from '@metamask/snap-types';
import { getDefaultSnapState } from '../testUtils/constants';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';

describe('keyDidResolver', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
    walletMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.wallet = walletMock;
  });

  describe('resolveDidKey', () => {
    it('', () => {
      // TODO
    });
  });

  describe('resolveSecp256k1', () => {
    // Maybe we can test everything with resolveDidKey
  });
});
