import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';
import { getKeysFromAddress } from '../../src/utils/keyPair';
import {
  bip44Entropy,
  getDefaultSnapState,
  address,
  privateKey,
  publicKey,
} from '../testUtils/constants';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';

describe('Test function: getAddressKey', function () {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  it('should get the ground address key of a specific address index from the BIP-44 entropy correctly', async function () {
    const initialState = getDefaultSnapState();
    const res = await getKeysFromAddress(
      bip44Entropy as BIP44CoinTypeNode,
      initialState,
      address,
      walletMock
    );
    expect(res).not.toBeNull();
    expect(res?.privateKey?.toUpperCase()).toEqual(
      privateKey.split('0x')[1].toUpperCase()
    );
    expect(res?.publicKey.toUpperCase()).toEqual(publicKey.toUpperCase());
    expect(res?.address.toUpperCase()).toEqual(address.toUpperCase());

    expect.assertions(4);
  });
});
