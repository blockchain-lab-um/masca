import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { getEmptyAccountState } from '../../src/utils/config';
import { getAddressKey, snapGetKeysFromAddress } from '../../src/utils/keyPair';
import {
  address,
  address2,
  bip44Entropy,
  derivedKeyChainCode,
  derivedKeyDerivationPath,
  getDefaultSnapState,
  privateKey,
  privateKey2,
  publicKey,
} from '../testUtils/constants';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

describe('keyPair', function () {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
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
        snapMock
      );
      expect(res).not.toBeNull();
      expect(res?.privateKey).toEqual(privateKey);
      expect(res?.publicKey).toEqual(publicKey);
      expect(res?.address).toEqual(address);

      const res2 = await snapGetKeysFromAddress(
        bip44Entropy as BIP44CoinTypeNode,
        initialState,
        address2,
        snapMock
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
        snapMock
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
      expect(res?.originalAddressKey).toBe(
        `${privateKey}${derivedKeyChainCode.split('0x')[1]}`
      );
      expect(res?.derivationPath).toEqual(derivedKeyDerivationPath);
      expect.assertions(4);
    });
  });
});
