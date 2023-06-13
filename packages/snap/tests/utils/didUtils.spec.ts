import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import elliptic from 'elliptic';

import {
  changeCurrentMethod,
  changeCurrentVCStore,
  getCurrentDid,
  resolveDid,
} from '../../src/utils/didUtils';
import {
  account,
  bip44Entropy,
  exampleDID,
  exampleDIDDocument,
  exampleDIDKey,
  exampleDIDKeyDocumentUniResovler,
  getDefaultSnapState,
  resolutionInvalidDID,
  resolutionMethodNotSupported,
  resolutionNotFound,
} from '../testUtils/constants';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

const { ec: EC } = elliptic;

describe('Utils [did]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(),
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('changeCurrentVCStore', () => {
    it("should succeed setting VC store to 'snap'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentVCStore({
          snap: snapMock,
          state: initialState,
          account,
          didStore: 'snap',
          value: true,
        })
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it("should succeed setting VC store to 'ceramic'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentVCStore({
          snap: snapMock,
          state: initialState,
          account,
          didStore: 'ceramic',
          value: true,
        })
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
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
    it('should return did:ethr', async () => {
      const initialState = getDefaultSnapState();

      const ctx = new EC('secp256k1');
      const ecPublicKey = ctx.keyFromPublic(
        initialState.accountState[account].publicKey.slice(2),
        'hex'
      );
      const compactPublicKey = `0x${ecPublicKey.getPublic(true, 'hex')}`;

      const expectedDid = `did:ethr:0x5:${compactPublicKey}`;

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
      const initialState = getDefaultSnapState();
      initialState.accountState[account].accountConfig.ssi.didMethod =
        'did:key';

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
    it("should succeed setting DID method to 'did:ethr'", async () => {
      const initialState = getDefaultSnapState();

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
      const initialState = getDefaultSnapState();

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
          did: exampleDID,
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc.didDocument).toEqual(exampleDIDDocument);
        expect.assertions(1);
      });
      it('should succeed resolving did:key identifier', async () => {
        const didDoc = await resolveDid({
          did: exampleDIDKey,
          snap: snapMock,
          ethereum: ethereumMock,
        });
        expect(didDoc.didDocument).toEqual(exampleDIDKeyDocumentUniResovler);
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
