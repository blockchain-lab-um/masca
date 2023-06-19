import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { getEmptyAccountState } from '../../src/utils/config';
import {
  getAddressKeyPair,
  snapGetKeysFromAddress,
} from '../../src/utils/keyPair';
import {
  account,
  account2,
  bip44Entropy,
  derivedKeyChainCode,
  derivedKeyDerivationPath,
  entropyDerivedPrivateKey,
  entropyDerivedPrivateKey2,
  entropyDerivedPublicKey,
  getDefaultSnapState,
  privateKey,
} from '../testUtils/constants';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

// global.snap = createMockSnap();

describe('keyPair', function () {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('snapGetKeysFromAddress', () => {
    it('should get the ground address key of a specific address index from the BIP-44 entropy correctly', async function () {
      const initialState = getDefaultSnapState();
      initialState.accountState[account2] = getEmptyAccountState();
      initialState.accountState[account].index = undefined;
      initialState.accountState[account2].index = undefined;
      const bip44CoinTypeNode = bip44Entropy as BIP44CoinTypeNode;
      const res = await snapGetKeysFromAddress({
        snap: snapMock,
        bip44CoinTypeNode,
        account,
      });
      expect(res).not.toBeNull();
      expect(res?.privateKey).toEqual(entropyDerivedPrivateKey);
      expect(res?.publicKey).toEqual(entropyDerivedPublicKey);
      expect(res?.address).toEqual(account);

      const res2 = await snapGetKeysFromAddress({
        snap: snapMock,
        bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        account: account2,
      });
      expect(res2).not.toBeNull();
      expect(res2?.address).toEqual(account2);
      expect(res2?.privateKey).toEqual(entropyDerivedPrivateKey2);

      expect.assertions(7);
    });

    it('should fail to get a ground key', async function () {
      const initialState = getDefaultSnapState();
      initialState.accountState['0x'] = getEmptyAccountState();
      const bip44CoinTypeNode = bip44Entropy as BIP44CoinTypeNode;
      const res = await snapGetKeysFromAddress({
        snap: snapMock,
        bip44CoinTypeNode,
        account: '0x',
      });
      expect(res).toBeNull();
      expect.assertions(1);
    });
  });

  describe('getAddressKey', () => {
    it('should get the address key of a specific address index and BIP-44 Coin Type Node', async function () {
      const res = await getAddressKeyPair({
        bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        accountIndex: 0,
      });
      expect(res).not.toBeNull();
      expect(res?.privateKey).toEqual(privateKey);
      expect(res?.originalAddressKey).toBe(
        `${privateKey}${derivedKeyChainCode.split('0x')[1]}`
      );
      expect(res?.derivationPath).toEqual(derivedKeyDerivationPath);
      expect.assertions(4);
    });
  });
});
