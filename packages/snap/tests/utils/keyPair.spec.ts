import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { getEmptyAccountState } from '../../src/utils/config';
import { snapGetKeysFromAddress } from '../../src/utils/keyPair';
import {
  account,
  account2,
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
      initialState.accountState[account2] = getEmptyAccountState();

      // Derive keys for the first account
      let res = await snapGetKeysFromAddress({
        bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        account,
        snap: snapMock,
      });

      expect(res).toStrictEqual({
        account,
        addressIndex: 0,
        derivationPath: "m / bip32:44' / bip32:60' / bip32:0' / bip32:0",
        privateKey,
        publicKey,
      });

      // Derive keys for the second account
      res = await snapGetKeysFromAddress({
        bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        account: account2,
        snap: snapMock,
      });

      expect(res).toStrictEqual({
        address: account2,
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
        snapGetKeysFromAddress({
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
          account: '0x',
          snap: snapMock,
        })
      ).rejects.toThrow('Failed to get keys');

      expect.assertions(1);
    });
  });
});
