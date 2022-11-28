import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';
import { getEmptyAccountState } from '../../src/utils/config';
import { getAddressKey, snapGetKeysFromAddress } from '../../src/utils/keyPair';
import {
  bip44Entropy,
  getDefaultSnapState,
  address,
  privateKey,
  publicKey,
  address2,
  privateKey2,
  derivedKeyChainCode,
  derivedKeyDerivationPath,
} from '../testUtils/constants';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';

describe('keyPair', function () {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('snapGetKeysFromAddress', () => {
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
      expect(res?.privateKey).toEqual(privateKey);
      expect(res?.publicKey).toEqual(publicKey);
      expect(res?.address).toEqual(address);

      const res2 = await snapGetKeysFromAddress(
        bip44Entropy as BIP44CoinTypeNode,
        initialState,
        address2,
        walletMock
      );
      expect(res2).not.toBeNull();
      expect(res2?.privateKey).toEqual(privateKey2);
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

  describe('getAddressKey', () => {
    it('should get the address key of a specific address index and BIP-44 Coin Type Node', async function () {
      const res = await getAddressKey(bip44Entropy as BIP44CoinTypeNode);
      expect(res).not.toBeNull();
      expect(res?.privateKey).toEqual(privateKey);
      expect(res?.originalAddressKey).toEqual(
        `${privateKey}${derivedKeyChainCode.split('0x')[1]}`
      );
      expect(res?.derivationPath).toEqual(derivedKeyDerivationPath);
      expect.assertions(4);
    });
  });
});
