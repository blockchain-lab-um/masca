import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { getEmptyAccountState } from '../../src/utils/config';
import { snapGetKeysFromAddress } from '../../src/utils/keyPair';
import {
  address,
  address2,
  bip44Entropy,
  getDefaultSnapState,
  privateKey,
  privateKey2,
  publicKey,
  publicKey2,
} from '../testUtils/constants';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

describe('keyPair', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('snapGetKeysFromAddress', () => {
    it('should get the ground address key of a specific address index from the BIP-44 entropy correctly', async () => {
      // Initial state
      const initialState = getDefaultSnapState();

      // Add another account
      initialState.accountState[address2] = getEmptyAccountState();

      // Derive keys for the first account
      let res = await snapGetKeysFromAddress(
        bip44Entropy as BIP44CoinTypeNode,
        initialState,
        address,
        snapMock
      );

      expect(res).toStrictEqual({
        address,
        addressIndex: 0,
        derivationPath: "m / bip32:44' / bip32:60' / bip32:0' / bip32:0",
        privateKey,
        publicKey,
      });

      // Derive keys for the second account
      res = await snapGetKeysFromAddress(
        bip44Entropy as BIP44CoinTypeNode,
        initialState,
        address2,
        snapMock
      );

      expect(res).toStrictEqual({
        address: address2,
        addressIndex: 1,
        derivationPath: "m / bip32:44' / bip32:60' / bip32:0' / bip32:0",
        privateKey: privateKey2,
        publicKey: publicKey2,
      });

      expect.assertions(2);
    });

    it('should fail to get a ground key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState['0x'] = getEmptyAccountState();

      await expect(
        snapGetKeysFromAddress(
          bip44Entropy as BIP44CoinTypeNode,
          initialState,
          '0x',
          snapMock
        )
      ).rejects.toThrow('Failed to get keys');

      expect.assertions(1);
    });
  });
});
