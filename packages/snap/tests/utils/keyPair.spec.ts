import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';
import { getEmptyAccountState } from '../../src/utils/config';
import { snapGetKeysFromAddress } from '../../src/utils/keyPair';
import {
  bip44Entropy,
  getDefaultSnapState,
  address,
  privateKey,
  publicKey,
  address2,
  privateKey2,
} from '../testUtils/constants';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';

describe('Test function: getAddressKey', function () {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  it('should get the ground address key of a specific address index from the BIP-44 entropy correctly', async function () {
    const initialState = getDefaultSnapState();
    initialState.accountState[address2] = getEmptyAccountState();
    initialState.accountState[address].index = undefined;
    initialState.accountState[address2].index = undefined;
    const res = await snapGetKeysFromAddress(
      bip44Entropy as BIP44CoinTypeNode,
      initialState,
      address,
      walletMock
    );
    expect(res).not.toBeNull();
    expect(res?.privateKey).toEqual(privateKey.split('0x')[1]);
    expect(res?.publicKey).toEqual(publicKey);
    expect(res?.address).toEqual(address);

    const res2 = await snapGetKeysFromAddress(
      bip44Entropy as BIP44CoinTypeNode,
      initialState,
      address2,
      walletMock
    );
    expect(res2).not.toBeNull();
    expect(res2?.privateKey).toEqual(privateKey2.split('0x')[1]);
    expect(res2?.address).toEqual(address2);

    expect.assertions(7);
  });
  it('should fail to get a ground key', async function () {
    const initialState = getDefaultSnapState();
    initialState.accountState['0x'] = getEmptyAccountState();
    const res = await snapGetKeysFromAddress(
      bip44Entropy as BIP44CoinTypeNode,
      initialState,
      '0x',
      walletMock
    );
    expect(res).toBeNull();
    expect.assertions(1);
  });
});
