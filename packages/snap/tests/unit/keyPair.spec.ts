import { InternalSigMethods } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import {
  getAccountIndexFromEntropy,
  getKeysFromAccountIndex,
} from '../../src/utils/keyPair';
import { account, didMethodAccountMapping } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const methods: InternalSigMethods[] = ['did:key', 'did:jwk'];

describe('Utils [keyPair]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;
  let bip44CoinTypeNode: BIP44CoinTypeNode;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      newState: getDefaultSnapState(account),
      operation: 'update',
    });
    bip44CoinTypeNode = await snapMock.rpcMocks.snap_getBip44Entropy({
      coinType: 1236,
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
  });

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });

    global.snap = snapMock;
    global.ethereum = ethereumMock;
  });
  // FIXME: revisit when address indices will be set for different did methods
  describe('entropy based account index and key derivation', () => {
    it.each(methods)(
      'should get address keypair for available methods %s',
      async (method) => {
        const accountIndex = await getAccountIndexFromEntropy({
          snap,
          account,
        });

        const keys = await getKeysFromAccountIndex({
          bip44CoinTypeNode,
          accountIndex,
          method,
        });
        expect(keys?.privateKey).toEqual(
          didMethodAccountMapping[method].privateKey
        );
        expect(keys?.publicKey).toEqual(
          didMethodAccountMapping[method].publicKey
        );
        expect(keys?.address).toEqual(didMethodAccountMapping[method].address);
        expect(keys?.accountIndex).toEqual(
          didMethodAccountMapping[method].accountIndex
        );
        expect(keys?.addressIndex).toEqual(
          didMethodAccountMapping[method].addressIndex
        );
        expect.assertions(5);
      }
    );
  });
});
