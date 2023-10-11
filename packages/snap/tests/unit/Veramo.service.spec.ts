import { CURRENT_STATE_VERSION, Filter } from '@blockchain-lab-um/masca-types';
import { StreamID } from '@ceramicnetwork/streamid';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { IIdentifier } from '@veramo/core';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import GeneralService from '../../src/General.service';
import StorageService from '../../src/storage/Storage.service';
import type { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import VeramoService from '../../src/veramo/Veramo.service';
import WalletService from '../../src/Wallet.service';
import {
  account,
  jsonPath,
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
import {
  EXAMPLE_VC,
  EXAMPLE_VC_EIP712,
  EXAMPLE_VC_LDS,
  EXAMPLE_VC2,
} from '../data/verifiable-credentials';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const credentials = [EXAMPLE_VC, EXAMPLE_VC2, EXAMPLE_VC_EIP712];

describe('Veramo Service', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ceramicData: StoredCredentials;

  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    ceramicData = {} as StoredCredentials;
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await StorageService.init();
    await VeramoService.init();
  });

  beforeAll(() => {
    // Ceramic mock
    DIDDataStore.prototype.get = vi
      .fn()
      .mockImplementation(async (_key, _did) => ceramicData);

    DIDDataStore.prototype.merge = vi
      .fn()
      .mockImplementation(async (_key, content, _options?) => {
        ceramicData = content as StoredCredentials;
        return 'ok' as unknown as StreamID;
      });
  });

  describe('VeramoService.saveCredential', () => {
    it('should succeed saving VC in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);
      expect.assertions(1);
    });

    it('should succeed saving JSON-LD VC in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC_LDS,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);

      const query = await VeramoService.queryCredentials({
        options: {},
      });
      expect(query[0].data).toEqual(EXAMPLE_VC_LDS);
      expect.assertions(2);
    });

    it('should succeed saving EIP712 VC in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC_EIP712,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);
      const query = await VeramoService.queryCredentials({
        options: {},
      });
      expect(query[0].data).toEqual(EXAMPLE_VC_EIP712);
      expect.assertions(2);
    });

    it('should succeed saving VC in snap and ceramic store', async () => {
      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap', 'ceramic'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: expect.arrayContaining(['snap', 'ceramic']),
        },
      ];

      expect(res).toIncludeSameMembers(expectedResult);

      expect.assertions(1);
    });

    it('should succeed saving a JWT string in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC.proof.jwt,
        store: ['snap'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);
      expect.assertions(1);
    });
    it.todo('should fail saving invalid object');
  });

  describe('VeramoService.deleteCredential', () => {
    it('should succeed deleting VCs in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      const expectedState = getDefaultSnapState(account);
      expectedState[CURRENT_STATE_VERSION].accountState[
        account
      ].veramo.credentials[res[0].id] = EXAMPLE_VC;
      expect(res).toEqual(expectedResult);

      await VeramoService.deleteCredential({
        id: expectedResult[0].id,
        store: ['snap'],
      });

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });

    it('should succeed deleting VCs in ceramic store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap', 'ceramic'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: expect.arrayContaining(['snap', 'ceramic']),
        },
      ];

      const vcsPreDelete = await VeramoService.queryCredentials({
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });

      expect(vcsPreDelete).toHaveLength(1);
      expect(vcsPreDelete[0].metadata.store).toIncludeSameMembers([
        'snap',
        'ceramic',
      ]);
      expect(res).toIncludeSameMembers(expectedResult);

      await VeramoService.deleteCredential({
        id: expectedResult[0].id,
        store: ['ceramic'],
      });

      const vcs = await VeramoService.queryCredentials({
        options: { returnStore: true },
      });

      const vcsPostDelete = await VeramoService.queryCredentials({
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });

      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      expect(vcs).toHaveLength(1);
      expect(vcsPostDelete[0].metadata.store).toStrictEqual(['snap']);
      expect.assertions(5);
    });

    it('should succeed deleting VCs in all stores', async () => {
      await VeramoService.clearCredentials({
        store: ['ceramic'],
      });

      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap', 'ceramic'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: expect.arrayContaining(['snap', 'ceramic']),
        },
      ];

      expect(res).toIncludeSameMembers(expectedResult);

      const expectedState = getDefaultSnapState(account);
      expectedState[CURRENT_STATE_VERSION].accountState[
        account
      ].veramo.credentials[res[0].id] = EXAMPLE_VC;

      await VeramoService.deleteCredential({
        id: expectedResult[0].id,
      });

      const vcs = await VeramoService.queryCredentials({
        options: { returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('VeramoService.clearCredentials', () => {
    it('should succeed clearing VCs in snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState(account);
      expectedState[CURRENT_STATE_VERSION].accountState[
        account
      ].veramo.credentials[res[0].id] = EXAMPLE_VC;

      await VeramoService.clearCredentials({
        store: ['snap'],
      });

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(1);
    });

    it('should succeed clearing VCs in all stores', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState(account);
      expectedState[CURRENT_STATE_VERSION].accountState[
        account
      ].veramo.credentials[res[0].id] = EXAMPLE_VC;

      await VeramoService.clearCredentials({});

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(1);
    });
  });

  describe('VeramoService.queryCredentials', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should return all VCs from snap store - toggle ceramicVCStore', async () => {
      let state = getDefaultSnapState(account);

      await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap', 'ceramic'],
      });

      const preQuery = await VeramoService.queryCredentials({
        options: {},
      });
      expect(preQuery).toHaveLength(1);

      state = snapMock.rpcMocks.snap_manageState({
        operation: 'get',
      });

      state[CURRENT_STATE_VERSION].accountState[
        account
      ].general.account.ssi.storesEnabled = {
        snap: true,
        ceramic: false,
      };

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: state,
      });

      await VeramoService.init();

      const resRet = await GeneralService.getEnabledCredentialStores();
      expect(resRet).toEqual(['snap']);

      let queryRes = await VeramoService.queryCredentials({
        options: {
          returnStore: true,
        },
      });

      expect(queryRes).toHaveLength(1);
      expect(queryRes[0].metadata.store).toEqual(['snap']);

      state = snapMock.rpcMocks.snap_manageState({
        operation: 'get',
      });

      state[CURRENT_STATE_VERSION].accountState[
        account
      ].general.account.ssi.storesEnabled = {
        snap: true,
        ceramic: true,
      };

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: state,
      });

      await VeramoService.init();

      const resRet2 = await GeneralService.getEnabledCredentialStores();
      expect(resRet2).toEqual(['snap', 'ceramic']);

      queryRes = await VeramoService.queryCredentials({
        options: {
          returnStore: true,
        },
      });

      expect(queryRes).toHaveLength(1);
      expect(queryRes[0].metadata.store).toIncludeSameMembers([
        'snap',
        'ceramic',
      ]);

      expect.assertions(7);
    });

    it('should succeed listing all VCs from snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing JWT VC from snap store', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC.proof.jwt,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);

      const vcs = await VeramoService.queryCredentials({
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toContainAllKeys([
        'credentialSubject',
        'issuer',
        'type',
        'credentialSchema',
        '@context',
        'issuanceDate',
        'proof',
      ]);
      expect.assertions(3);
    });

    it('should succeed listing all VCs from snap store - without returnStore', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id },
      };

      const queryRes = await VeramoService.queryCredentials({
        options: { store: ['snap'], returnStore: false },
      });
      expect(queryRes).toStrictEqual([expectedVCObject]);
      expect(queryRes[0].metadata.store).toBeUndefined();

      expect.assertions(2);
    });

    it('should succeed querying all VCs from snap store that match JSONPath', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
          filter: {
            type: 'JSONPath',
            filter: jsonPath,
          },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed querying all VCs from all stores that match JSONPath', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id, store: ['snap'] },
      };

      const filter = {
        type: 'JSONPath',
        filter: jsonPath,
      } as Filter;

      await expect(
        VeramoService.queryCredentials({
          filter,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty query', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'none', filter: '' },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query', async () => {
      const res = await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: EXAMPLE_VC,
        metadata: { id: res[0].id, store: ['snap'] },
      };

      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: res[0].id },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      await VeramoService.saveCredential({
        verifiableCredential: EXAMPLE_VC,
        store: ['snap'],
      });

      await expect(
        VeramoService.queryCredentials({
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: 'test-idd' },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });
  });
  describe('VeramoService.verifyData', () => {
    it.each(credentials)(
      'should succeed validating a VC $issuer.id $proof.type',
      async (credential) => {
        const verifyResult = await VeramoService.verifyData({
          credential,
        });

        expect(verifyResult.verified).toBe(true);
        expect.assertions(1);
      }
    );

    it('should succeed validating a VP - JWT', async () => {
      const agent = await VeramoService.createAgent();
      const identity: IIdentifier = await agent.didManagerCreate({
        provider: 'did:ethr',
        kms: 'snap',
      });

      const credential = await agent.createVerifiableCredential({
        proofFormat: 'jwt',
        credential: {
          issuer: identity.did,
          credentialSubject: {
            hello: 'world',
          },
        },
      });

      const presentation = await agent.createVerifiablePresentation({
        proofFormat: 'jwt',
        presentation: {
          holder: identity.did,
          verifiableCredential: [credential],
        },
      });

      const verifyResult = await VeramoService.verifyData({
        presentation,
      });

      expect(verifyResult.verified).toBe(true);
      expect.assertions(1);
    });
    it('should succeed validating a VP - Eip712', async () => {
      const agent = await VeramoService.createAgent();

      const identity: IIdentifier = await agent.didManagerCreate({
        provider: 'did:ethr',
        kms: 'snap',
      });

      const credential = await agent.createVerifiableCredential({
        proofFormat: 'EthereumEip712Signature2021',
        credential: {
          issuer: identity.did,
          credentialSubject: {
            hello: 'world',
          },
        },
      });

      const presentation = await agent.createVerifiablePresentation({
        proofFormat: 'EthereumEip712Signature2021',
        presentation: {
          holder: identity.did,
          verifiableCredential: [credential],
        },
      });

      const verifyResult = await VeramoService.verifyData({
        presentation,
      });

      expect(verifyResult.verified).toBe(true);
      expect.assertions(1);
    });

    it.skip('should succeed validating a VP - lds', async () => {
      const agent = await VeramoService.createAgent();
      const identity: IIdentifier = await agent.didManagerCreate({
        provider: 'did:ethr',
        kms: 'snap',
      });

      const credential = await agent.createVerifiableCredential({
        proofFormat: 'lds',
        credential: {
          issuer: identity.did,
          credentialSubject: {},
        },
      });

      const presentation = await agent.createVerifiablePresentation({
        proofFormat: 'lds',
        presentation: {
          holder: identity.did,
          verifiableCredential: [credential],
        },
      });

      const verifyResult = await VeramoService.verifyData({
        presentation,
      });

      // Waiting for Veramo to fix this
      // verifying a VP with lds proof format fails
      // expect(verifyResult.verified).toBe(true);
      expect(verifyResult).not.toBeNull();
      expect.assertions(1);
    });
  });

  describe('VeramoService.getIdentifier', () => {
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
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod = 'did:key';
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

  describe('VeramoService.resolveDID', () => {
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
