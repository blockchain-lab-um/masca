import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import StorageService from '../../src/storage/Storage.service';
import VeramoService from '../../src/veramo/Veramo.service';
import WalletService from '../../src/Wallet.service';
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
  exampleDIDKeyImportedAccount,
} from '../data/identifiers/didKey';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('Utils [did]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });

    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await StorageService.init();
    await VeramoService.init();
  });

  describe('getCurrentDid', () => {
    it('should return did:ethr', async () => {
      const expectedDid = {
        did: 'did:ethr:0x1:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        keys: [],
        provider: 'did:ethr',
        services: [],
      };

      await expect(VeramoService.getIdentifier()).resolves.toStrictEqual(
        expectedDid
      );

      expect.assertions(1);
    });

    it('should return did:key', async () => {
      const state = StorageService.get();
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod =
        'did:key';
      await StorageService.save();

      // Need to re-initialize VeramoService with new state
      await WalletService.init();
      await VeramoService.init();
      await VeramoService.importIdentifier();
      await expect(VeramoService.getIdentifier()).resolves.toStrictEqual(
        exampleDIDKeyImportedAccount
      );

      expect.assertions(1);
    });
  });

  describe('resolveDID', () => {
    it('should succeed resolving did:ethr identifier', async () => {
      const didDoc = await VeramoService.resolveDID(exampleDIDEthrMainnet);
      expect(didDoc.didDocument).toEqual(exampleDIDEthrMainnetDocument);
      expect.assertions(1);
    });

    it('should succeed resolving did:key identifier', async () => {
      const didDoc = await VeramoService.resolveDID(exampleDIDKey);
      expect(didDoc.didDocument).toEqual(exampleDIDKeyDocument);
      expect.assertions(1);
    });

    it('should resolve invalid did', async () => {
      const didDoc = await VeramoService.resolveDID('did:ethr:0x5:0x123');
      expect(didDoc).toEqual(resolutionInvalidDID);
      expect.assertions(1);
    });

    it('should resolve nonExisting did', async () => {
      const didDoc = await VeramoService.resolveDID('did:key:zQ3shW537');
      expect(didDoc).toEqual(resolutionNotFound);
      expect.assertions(1);
    });

    it('should resolve methodNotSupported', async () => {
      const didDoc = await VeramoService.resolveDID('did:keyclopse:zQ3shW537');
      expect(didDoc).toEqual(resolutionMethodNotSupported);
      expect.assertions(1);
    });
  });
});
