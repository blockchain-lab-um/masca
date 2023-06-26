import { StreamID } from '@ceramicnetwork/streamid';
import { DIDDataStore } from '@glazed/did-datastore';
import { BIP44CoinTypeNode } from '@metamask/key-tree/dist/BIP44CoinTypeNode';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { IIdentifier } from '@veramo/core';
import { getEnabledVCStores } from '../../src/utils/snapUtils';
import {
  veramoClearVCs,
  veramoDeleteVC,
  veramoImportMetaMaskAccount,
  veramoQueryVCs,
  veramoSaveVC,
  veramoVerifyData,
} from '../../src/utils/veramoUtils';
import type { StoredCredentials } from '../../src/veramo/plugins/ceramicDataStore/ceramicDataStore';
import { getAgent } from '../../src/veramo/setup';
import { account, jsonPath } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import {
  exampleDIDKey,
  exampleDIDKeyImportedAccount,
} from '../data/identifiers/didKey';
import exampleVCEIP712 from '../data/verifiable-credentials/exampleEIP712.json';
import exampleVCJSONLD from '../data/verifiable-credentials/exampleJSONLD.json';
import exampleVC from '../data/verifiable-credentials/exampleJWT.json';
import exampleVC_2 from '../data/verifiable-credentials/exampleJWT_2.json';
import exampleVC_3 from '../data/verifiable-credentials/exampleJWT_3.json';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const credentials = [exampleVC, exampleVC_2, exampleVC_3, exampleVCEIP712];

describe('Utils [veramo]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;
  let ceramicData: StoredCredentials;
  let bip44Entropy: BIP44CoinTypeNode;
  beforeEach(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    ceramicData = {} as StoredCredentials;
    global.snap = snapMock;
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    bip44Entropy = await snapMock.rpcMocks.snap_getBip44Entropy({
      coinType: 1236,
    });
  });

  beforeAll(() => {
    // Ceramic mock
    DIDDataStore.prototype.get = jest
      .fn()
      .mockImplementation(async (_key, _did) => ceramicData);

    DIDDataStore.prototype.merge = jest
      .fn()
      .mockImplementation(async (_key, content, _options?) => {
        ceramicData = content as StoredCredentials;
        return 'ok' as unknown as StreamID;
      });
  });

  describe('veramoSaveVC', () => {
    it('should succeed saving VC in snap store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
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
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVCJSONLD,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);

      const query = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: {},
      });
      expect(query[0].data).toEqual(exampleVCJSONLD);
      expect.assertions(2);
    });

    it('should succeed saving EIP712 VC in snap store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVCEIP712,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);
      const query = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: {},
      });
      expect(query[0].data).toEqual(exampleVCEIP712);
      expect.assertions(2);
    });

    it('should succeed saving VC in snap and ceramic store', async () => {
      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
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
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC.proof.jwt,
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

  describe('veramoDeleteVC', () => {
    it('should succeed deleting VCs in snap store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      const expectedState = getDefaultSnapState(account);
      expectedState.accountState[account].vcs[res[0].id] = exampleVC;
      expect(res).toEqual(expectedResult);
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoDeleteVC({
        snap: snapMock,
        ethereum: ethereumMock,
        id: expectedResult[0].id,
        store: ['snap'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(3);
    });

    it('should succeed deleting VCs in ceramic store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: expect.arrayContaining(['snap', 'ceramic']),
        },
      ];

      const vcsPreDelete = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });

      expect(vcsPreDelete).toHaveLength(1);
      expect(vcsPreDelete[0].metadata.store).toIncludeSameMembers([
        'snap',
        'ceramic',
      ]);
      expect(res).toIncludeSameMembers(expectedResult);

      await veramoDeleteVC({
        snap: snapMock,
        ethereum: ethereumMock,
        id: expectedResult[0].id,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { returnStore: true },
      });

      const vcsPostDelete = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      expect(vcs).toHaveLength(1);
      expect(vcsPostDelete[0].metadata.store).toStrictEqual(['snap']);
      expect.assertions(5);
    });

    it('should succeed deleting VCs in all stores', async () => {
      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['ceramic'],
      });

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
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
      expectedState.accountState[account].vcs[res[0].id] = exampleVC;
      await veramoDeleteVC({
        snap: snapMock,
        ethereum: ethereumMock,
        id: expectedResult[0].id,
      });

      await veramoDeleteVC({
        snap: snapMock,
        ethereum: ethereumMock,
        id: expectedResult[0].id,
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('veramoClearVC', () => {
    it('should succeed clearing VCs in snap store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState(account);
      expectedState.accountState[account].vcs[res[0].id] = exampleVC;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        store: ['snap'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });

    it('should succeed clearing VCs in all stores', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState(account);
      expectedState.accountState[account].vcs[res[0].id] = exampleVC;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum: ethereumMock,
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('veramoQueryVCs', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should return all VCs from snap store - toggle ceramicVCStore', async () => {
      let state = getDefaultSnapState(account);

      await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });

      const preQuery = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: {},
      });
      expect(preQuery).toHaveLength(1);

      state = snapMock.rpcMocks.snap_manageState({
        operation: 'get',
      });

      state.accountState[account].accountConfig.ssi.vcStore = {
        snap: true,
        ceramic: false,
      };

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: state,
      });

      const resRet = getEnabledVCStores(account, state);
      expect(resRet).toEqual(['snap']);

      let queryRes = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: {
          returnStore: true,
        },
      });

      expect(queryRes).toHaveLength(1);
      expect(queryRes[0].metadata.store).toEqual(['snap']);

      state = snapMock.rpcMocks.snap_manageState({
        operation: 'get',
      });

      state.accountState[account].accountConfig.ssi.vcStore = {
        snap: true,
        ceramic: true,
      };

      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: state,
      });

      const resRet2 = getEnabledVCStores(account, state);
      expect(resRet2).toEqual(['snap', 'ceramic']);

      queryRes = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
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
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing JWT VC from snap store', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: ['snap'],
        },
      ];

      expect(res).toEqual(expectedResult);

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toContainAllKeys([
        'credentialSubject',
        'issuer',
        'id',
        'type',
        'credentialStatus',
        '@context',
        'issuanceDate',
        'proof',
      ]);
      expect.assertions(3);
    });

    it('should succeed listing all VCs from snap store - without returnStore', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id },
      };

      const queryRes = await veramoQueryVCs({
        snap: snapMock,
        ethereum: ethereumMock,
        options: { store: ['snap'], returnStore: false },
      });
      expect(queryRes).toStrictEqual([expectedVCObject]);
      expect(queryRes[0].metadata.store).toBeUndefined();

      expect.assertions(2);
    });

    it('should succeed querying all VCs from snap store that match JSONPath', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
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
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: ['snap'] },
      };

      const filter = {
        type: 'JSONPath',
        filter: jsonPath,
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          filter,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty query', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: ['snap'] },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'none', filter: {} },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query', async () => {
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: ['snap'] },
      };

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: res[0].id },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      await veramoSaveVC({
        snap: snapMock,
        ethereum: ethereumMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum: ethereumMock,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: 'test-idd' },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });
  });

  describe('veramoImportMetaMaskAccount', () => {
    it('should succeed importing metamask account', async () => {
      const initialState = getDefaultSnapState(account);
      initialState.accountState[account].accountConfig.ssi.didMethod =
        'did:key';
      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);
      const agent = await getAgent(snapMock, ethereumMock);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum: ethereumMock,
              state: initialState,
              account,
              bip44CoinTypeNode: bip44Entropy,
            },
            agent
          )
        ).did
      ).toEqual(exampleDIDKey);

      await expect(
        agent.didManagerGet({ did: exampleDIDKey })
      ).resolves.toEqual(exampleDIDKeyImportedAccount);

      expect.assertions(2);
    });

    it('should succeed importing metamask account when DID already exists', async () => {
      const initialState = getDefaultSnapState(account);
      initialState.accountState[account].accountConfig.ssi.didMethod =
        'did:key';
      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      const agent = await getAgent(snapMock, ethereumMock);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum: ethereumMock,
              state: initialState,
              account,
              bip44CoinTypeNode: bip44Entropy,
            },
            agent
          )
        ).did
      ).toEqual(exampleDIDKey);

      await expect(
        agent.didManagerGet({ did: exampleDIDKey })
      ).resolves.toEqual(exampleDIDKeyImportedAccount);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum: ethereumMock,
              state: initialState,
              account,
              bip44CoinTypeNode: bip44Entropy,
            },
            agent
          )
        ).did
      ).toEqual(exampleDIDKey);

      expect(await agent.didManagerFind()).toHaveLength(1);

      expect.assertions(4);
    });
  });
    describe('veramoVerifyData', () => {
      it.each(credentials)('should succeed validating a VC $issuer.id $proof.type', async (credential) => {
        const verifyResult = await veramoVerifyData({
          snap: snapMock,
          ethereum: ethereumMock,
          data: { credential },
        });

        console.log(verifyResult.error);
        
        
        expect(verifyResult.verified).toBe(true);
        expect.assertions(1);
      });

      it('should succeed validating a VP - JWT', async () => {
        const agent = await getAgent(snapMock, ethereumMock);
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

        const verifyResult = await veramoVerifyData({
          snap: snapMock,
          ethereum: ethereumMock,
          data: { presentation },
        });

        expect(verifyResult.verified).toBe(true);
        expect.assertions(1);
      });
      it('should succeed validating a VP - Eip712', async () => {
        const agent = await getAgent(snapMock, ethereumMock);
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

        const verifyResult = await veramoVerifyData({
          snap: snapMock,
          ethereum: ethereumMock,
          data: { presentation },
        });

        expect(verifyResult.verified).toBe(true);
        expect.assertions(1);
      });

      it.skip('should succeed validating a VP - lds', async () => {
        const agent = await getAgent(snapMock, ethereumMock);
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

        const verifyResult = await veramoVerifyData({
          snap: snapMock,
          ethereum: ethereumMock,
          data: { presentation },
        });

        // Waiting for Veramo to fix this
        // verifying a VP with lds proof format fails
        // expect(verifyResult.verified).toBe(true);
        expect(verifyResult).not.toBeNull();
        expect.assertions(1);
      });
    });

  //   describe('veramoCreateVP', () => {
  //     it('should succeed creating a valid VP', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         { proofFormat: 'jwt', vcs: [exampleVC] }
  //       );
  //       expect(createdVP).not.toBeNull();

  //       const verifyResult = await agent.verifyPresentation({
  //         presentation: createdVP,
  //       });

  //       expect(verifyResult.verified).toBe(true);

  //       expect.assertions(2);
  //     });

  //     it.skip('should succeed creating a valid VP - lds', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         // verifiableCredential: exampleVCJSONLD,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         {
  //           proofFormat: 'lds',
  //           vcs: [{ id: res[0].id }],
  //           proofOptions: { challenge: 'test-challenge' },
  //         }
  //       );

  //       expect(createdVP).not.toBeNull();

  //       // Waiting for Veramo to fix this
  //       // await expect(
  //       //   await agent.verifyPresentation({
  //       //     presentation: createdVP as VerifiablePresentation,
  //       //     challenge: 'test-challenge',
  //       //   })
  //       // ).toThrow();
  //       // expect(verifyResult.verified).toBe(true);
  //       expect.assertions(1);
  //     });

  //     it('should succeed creating a valid VP - eip712', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         { proofFormat: 'EthereumEip712Signature2021', vcs: [exampleVC] }
  //       );
  //       expect(createdVP).not.toBeNull();

  //       const verifyResult = await agent.verifyPresentation({
  //         presentation: createdVP,
  //       });

  //       expect(verifyResult.verified).toBe(true);

  //       expect.assertions(2);
  //     });

  //     it('should succeed creating a valid VP with one false id', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         { proofFormat: 'jwt', vcs: [exampleVC] }
  //       );
  //       expect(createdVP).not.toBeNull();

  //       const verifyResult = await agent.verifyPresentation({
  //         presentation: createdVP,
  //       });

  //       expect(verifyResult.verified).toBe(true);

  //       expect.assertions(2);
  //     });

  //     it('should succeed creating a valid VP with 2 VCs', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         { proofFormat: 'jwt', vcs: [exampleVC, exampleVC] }
  //       );
  //       expect(createdVP).not.toBeNull();

  //       const verifyResult = await agent.verifyPresentation({
  //         presentation: createdVP,
  //       });

  //       expect(createdVP?.verifiableCredential).toStrictEqual([
  //         exampleVCinVP,
  //         exampleVCinVP,
  //       ]);

  //       expect(verifyResult.verified).toBe(true);

  //       expect.assertions(3);
  //     });

  //     it('should succeed creating a valid VP with 4 different types of VCs', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
  //       const agent = await getAgent(snapMock, ethereumMock);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });
  //       const resjwt = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC.proof.jwt,
  //         store: ['snap'],
  //       });
  //       const res2 = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVCJSONLD,
  //         store: ['snap'],
  //       });

  //       const res3 = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVCEIP712,
  //         store: ['snap'],
  //       });

  //       const createdVP = await veramoCreateVP(
  //         {
  //           snap: snapMock,
  //           ethereum: ethereumMock,
  //           state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //           account,
  //           bip44CoinTypeNode: bip44Entropy ,
  //         },
  //         {
  //           proofFormat: 'jwt',
  //           vcs: [exampleVC, exampleVC, exampleVCJSONLD, exampleVCEIP712],
  //         }
  //       );
  //       expect(createdVP).not.toBeNull();

  //       const verifyResult = await agent.verifyPresentation({
  //         presentation: createdVP,
  //       });

  //       expect(createdVP?.verifiableCredential).toStrictEqual([
  //         exampleVCinVP,
  //         exampleVCinVP,
  //         exampleVCJSONLD,
  //         exampleVCEIP712,
  //       ]);

  //       expect(verifyResult.verified).toBe(true);

  //       expect.assertions(3);
  //     });

  //     it('should fail creating a VP and throw user rejected error', async () => {
  //       snapMock.rpcMocks.snap_dialog.mockResolvedValue(false);

  //       const res = await veramoSaveVC({
  //         snap: snapMock,
  //         ethereum: ethereumMock,
  //         verifiableCredential: exampleVC,
  //         store: ['snap'],
  //       });

  //       await expect(
  //         veramoCreateVP(
  //           {
  //             snap: snapMock,
  //             ethereum: ethereumMock,
  //             state: snapMock.rpcMocks.snap_manageState({ operation: 'get' }),
  //             account,
  //             bip44CoinTypeNode: bip44Entropy ,
  //           },
  //           { proofFormat: 'jwt', vcs: [{ id: res[0].id }] }
  //         )
  //       ).rejects.toThrow('User rejected create VP request');

  //       expect.assertions(1);
  //     });
  //   });
});
