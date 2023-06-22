import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import elliptic from 'elliptic';

import {
  changeCurrentMethod,
  changeCurrentVCStore,
  getCurrentDid,
  resolveDid,
} from '../../src/utils/didUtils';
import {
  account,
  resolutionInvalidDID,
  resolutionMethodNotSupported,
  resolutionNotFound,
} from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import {
  exampleDIDEthrMainnet,
  exampleDIDEthrMainnetDocument,
} from '../data/identifiers/didEthrMainnet';
import {
  exampleDIDKey,
  exampleDIDKeyDocument,
} from '../data/identifiers/didKey';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const { ec: EC } = elliptic;

describe('Utils [did]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('changeCurrentVCStore', () => {
    it("should succeed setting VC store to 'snap'", async () => {
      const initialState = getDefaultSnapState(account);

      await expect(
        changeCurrentVCStore({
          snap: snapMock,
          state: initialState,
          account,
          didStore: 'snap',
          value: true,
        })
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState(account);

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it("should succeed setting VC store to 'ceramic'", async () => {
      const initialState = getDefaultSnapState(account);

      await expect(
        changeCurrentVCStore({
          snap: snapMock,
          state: initialState,
          account,
          didStore: 'ceramic',
          value: true,
        })
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState(account);
      expectedState.accountState[account].accountConfig.ssi.vcStore.ceramic =
        true;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });
  });

  describe('getCurrentDid', () => {
    it.skip('should return did:ethr', async () => {
      const initialState = getDefaultSnapState(account);

      const bip44Entropy = await snapMock.rpcMocks.snap_getBip44Entropy({
        coinType: 1236,
      });

      const expectedDid = `did:ethr:0x5`;

      await expect(
        getCurrentDid({
          ethereum: ethereumMock,
          snap: snapMock,
          state: initialState,
          account,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.toBe(expectedDid);

      expect.assertions(1);
    });

    it('should return did:key', async () => {
      const initialState = getDefaultSnapState(account);
      initialState.accountState[account].accountConfig.ssi.didMethod =
        'did:key';

      const bip44Entropy = await snapMock.rpcMocks.snap_getBip44Entropy({
        coinType: 1236,
      });

      await expect(
        getCurrentDid({
          ethereum: ethereumMock,
          snap: snapMock,
          state: initialState,
          account,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        })
      ).resolves.toBe(exampleDIDKey);

      expect.assertions(1);
    });
  });

  describe('changeCurrentMethod', () => {
    it.skip("should succeed setting DID method to 'did:ethr'", async () => {
      const initialState = getDefaultSnapState(account);

      const bip44Entropy = await snapMock.rpcMocks.snap_getBip44Entropy({
        coinType: 1236,
      });

      await expect(
        changeCurrentMethod({
          state: initialState,
          snap: snapMock,
          account,
          ethereum: ethereumMock,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
          didMethod: 'did:ethr',
        })
      ).resolves.toMatch(/(did:ethr)/i);

      expect.assertions(1);
    });

    it("should succeed setting DID method to 'did:key'", async () => {
      const initialState = getDefaultSnapState(account);

      const bip44Entropy = await snapMock.rpcMocks.snap_getBip44Entropy({
        coinType: 1236,
      });

      await expect(
        changeCurrentMethod({
          state: initialState,
          snap: snapMock,
          account,
          ethereum: ethereumMock,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
          didMethod: 'did:key',
        })
      ).resolves.toMatch(/(did:key)/i);

      expect.assertions(1);
    });

    describe('resolveDID', () => {
      it('should succeed resolving did:ethr identifier', async () => {
        const didDoc = await resolveDid({
          did: exampleDIDEthrMainnet,
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc.didDocument).toEqual(exampleDIDEthrMainnetDocument);
        expect.assertions(1);
      });
      it('should succeed resolving did:key identifier', async () => {
        const didDoc = await resolveDid({
          did: exampleDIDKey,
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc.didDocument).toEqual(exampleDIDKeyDocument);
        expect.assertions(1);
      });
      it('should resolve invalid did', async () => {
        const didDoc = await resolveDid({
          did: 'did:ethr:0x5:0x123',
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc).toEqual(resolutionInvalidDID);
        expect.assertions(1);
      });
      it('should resolve nonExisting did', async () => {
        const didDoc = await resolveDid({
          did: 'did:key:zQ3shW537',
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc).toEqual(resolutionNotFound);
        expect.assertions(1);
      });
      it('should resolve methodNotSupported', async () => {
        const didDoc = await resolveDid({
          did: 'did:keyclopse:zQ3shW537',
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc).toEqual(resolutionMethodNotSupported);
        expect.assertions(1);
      });
    });
  });
});
