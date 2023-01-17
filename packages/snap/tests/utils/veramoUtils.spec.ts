import { SnapsGlobalObject } from '@metamask/snaps-types';
import { IVerifyResult, VerifiablePresentation } from '@veramo/core';
import { BIP44CoinTypeNode } from '@metamask/key-tree/dist/BIP44CoinTypeNode';
import { StoredCredentials } from 'src/interfaces';
import { DIDDataStore } from '@glazed/did-datastore';
import { StreamID } from '@ceramicnetwork/streamid';
import { MetaMaskInpageProvider } from '@metamask/providers';
import * as snapUtils from '../../src/utils/snapUtils';
import { getAgent } from '../../src/veramo/setup';
import {
  veramoClearVCs,
  veramoCreateVP,
  veramoDeleteVC,
  veramoImportMetaMaskAccount,
  veramoQueryVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import {
  address,
  bip44Entropy,
  exampleDID,
  exampleImportedDIDWIthoutPrivateKey,
  exampleVC,
  exampleVCEIP712,
  exampleVCinVP,
  exampleVCJSONLD,
  getDefaultSnapState,
  jsonPath,
} from '../testUtils/constants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

let ceramicData: StoredCredentials;
jest
  .spyOn(DIDDataStore.prototype, 'get')
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  .mockImplementation(async (key, did?) => {
    return ceramicData;
  });
// jest
//   .spyOn(DIDDataStore.prototype, 'merge')
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
//   .mockImplementation(async (key, content, options?) => {
//     ceramicData = content as StoredCredentials;
//     return 'ok' as unknown as StreamID;
//   });

describe('Utils [veramo]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    ceramicData = {} as StoredCredentials;
    global.snap = snapMock;
  });

  describe('veramoSaveVC', () => {
    it('should succeed saving VC in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      expect(res).toEqual(expectedResult);
      expect.assertions(1);
    });
    it('should succeed saving JSON-LD VC in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVCJSONLD,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      expect(res).toEqual(expectedResult);

      const query = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: {},
      });
      expect(query[0].data).toEqual(exampleVCJSONLD);
      expect.assertions(2);
    });

    it('should succeed saving EIP712 VC in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVCEIP712,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      expect(res).toEqual(expectedResult);
      const query = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: {},
      });
      expect(query[0].data).toEqual(exampleVCEIP712);
      expect.assertions(2);
    });

    it('should succeed saving VC in snap and ceramic store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: ['ceramic'],
      });

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
        {
          id: res[1].id,
          store: 'ceramic',
        },
      ];

      expect(res).toEqual(expectedResult);

      expect.assertions(1);
    });
    it('should succeed saving a JWT string in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['snap'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      expect(res).toEqual(expectedResult);
      expect.assertions(1);
    });
    // TODO should fail saving invalid object
  });

  describe('veramoDeleteVC', () => {
    it('should succeed deleting VCs in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs[res[0].id] = exampleVC;
      expect(res).toEqual(expectedResult);
      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoDeleteVC({
        snap: snapMock,
        ethereum,
        id: expectedResult[0].id,
        store: ['snap'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(3);
    });

    it('should succeed deleting VCs in ceramic store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
        {
          id: res[1].id,
          store: 'ceramic',
        },
      ];

      const vcsPreDelete = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(2);
      expect(res).toEqual(expectedResult);
      await veramoDeleteVC({
        snap: snapMock,
        ethereum,
        id: expectedResult[1].id,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { returnStore: true },
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: ['ceramic'],
      });

      expect(vcs).toHaveLength(1);
      expect.assertions(3);
    });
    it('should succeed deleting VCs in all stores', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: ['ceramic'],
      });

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });
      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
        {
          id: res[1].id,
          store: 'ceramic',
        },
      ];

      expect(res).toEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs[res[0].id] = exampleVC;
      await veramoDeleteVC({
        snap: snapMock,
        ethereum,
        id: expectedResult[0].id,
      });

      await veramoDeleteVC({
        snap: snapMock,
        ethereum,
        id: expectedResult[1].id,
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('veramoClearVC', () => {
    it('should succeed clearing VCs in snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs[res[0].id] = exampleVC;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: ['snap'],
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
    it('should succeed clearing VCs in all stores', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());
      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs[res[0].id] = exampleVC;

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      await veramoClearVCs({
        snap: snapMock,
        ethereum,
      });

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('veramoQueryVCs', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should return all VCs from snap store - toggle ceramicVCStore', async () => {
      const state = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(state);
      await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap', 'ceramic'],
      });

      const preQuery = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: {},
      });
      expect(preQuery).toHaveLength(2);

      state.accountState[address].accountConfig.ssi.vcStore = {
        snap: true,
        ceramic: false,
      };
      snapMock.rpcMocks.snap_manageState.mockReturnValue(state);

      const resRet = snapUtils.getEnabledVCStores(address, state);
      expect(resRet).toEqual(['snap']);

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: {},
        })
      ).resolves.toHaveLength(1);

      state.accountState[address].accountConfig.ssi.vcStore = {
        snap: true,
        ceramic: true,
      };
      snapMock.rpcMocks.snap_manageState.mockReturnValue(state);

      const resRet2 = snapUtils.getEnabledVCStores(address, state);
      expect(resRet2).toEqual(['snap', 'ceramic']);

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: {},
        })
      ).resolves.toHaveLength(2);

      expect.assertions(5);
    });

    it('should succeed listing all VCs from snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing JWT VC from snap store', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['snap'],
      });

      const expectedResult = [
        {
          id: res[0].id,
          store: 'snap',
        },
      ];

      expect(res).toEqual(expectedResult);

      const vcs = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVCinVP);

      expect.assertions(3);
    });

    it('should succeed listing all VCs from snap store - without returnStore', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id },
      };

      const queryRes = await veramoQueryVCs({
        snap: snapMock,
        ethereum,
        options: { store: ['snap'], returnStore: false },
      });
      expect(queryRes).toStrictEqual([expectedVCObject]);
      expect(queryRes[0].metadata.store).toBeUndefined();

      expect.assertions(2);
    });

    it('should succeed querying all VCs from snap store that match JSONPath', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
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
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: 'snap' },
      };

      const filter = {
        type: 'JSONPath',
        filter: jsonPath,
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          filter,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty query', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'none', filter: {} },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: res[0].id, store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: res[0].id },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });
    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      snapMock.rpcMocks.snap_manageState.mockReturnValue(getDefaultSnapState());

      await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      await expect(
        veramoQueryVCs({
          snap: snapMock,
          ethereum,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: 'test-idd' },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });
  });

  describe('veramoImportMetaMaskAccount', () => {
    it('should succeed importing metamask account', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);
      const agent = await getAgent(snapMock, ethereum);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum,
              state: initialState,
              account: address,
              bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
            },
            agent
          )
        ).did
      ).toEqual(exampleDID);

      await expect(agent.didManagerGet({ did: exampleDID })).resolves.toEqual(
        exampleImportedDIDWIthoutPrivateKey
      );

      expect.assertions(2);
    });

    it('should succeed importing metamask account when DID already exists', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      const agent = await getAgent(snapMock, ethereum);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum,
              state: initialState,
              account: address,
              bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
            },
            agent
          )
        ).did
      ).toEqual(exampleDID);

      await expect(agent.didManagerGet({ did: exampleDID })).resolves.toEqual(
        exampleImportedDIDWIthoutPrivateKey
      );
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              snap: snapMock,
              ethereum,
              state: initialState,
              account: address,
              bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
            },
            agent
          )
        ).did
      ).toEqual(exampleDID);

      expect(await agent.didManagerFind()).toHaveLength(1);

      expect.assertions(4);
    });
  });

  describe('veramoCreateVP', () => {
    it('should succeed creating a valid VP', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: res[0].id }] }
      );
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

      expect.assertions(2);
    });

    it('should succeed creating a valid VP - lds', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        // verifiableCredential: exampleVCJSONLD,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        {
          proofFormat: 'lds',
          vcs: [{ id: res[0].id }],
          proofOptions: { challenge: 'test-challenge' },
        }
      );

      console.log(createdVP);
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
        challenge: 'test-challenge',
      })) as IVerifyResult;
      console.log(verifyResult.error);
      expect(verifyResult.verified).toBe(true);
      expect.assertions(2);
    });

    it('should succeed creating a valid VP - eip712', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'EthereumEip712Signature2021', vcs: [{ id: res[0].id }] }
      );
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

      expect.assertions(2);
    });

    it('should succeed creating a valid VP with one false id', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: res[0].id }, { id: 'wrong_id' }] }
      );
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

      expect.assertions(2);
    });

    it('should succeed creating a valid VP with 2 VCs', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: res[0].id }, { id: res[0].id }] }
      );
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(createdVP?.verifiableCredential).toStrictEqual([
        exampleVCinVP,
        exampleVCinVP,
      ]);

      expect(verifyResult.verified).toBe(true);

      expect.assertions(3);
    });

    it('should succeed creating a valid VP with 4 different types of VCs', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);
      const agent = await getAgent(snapMock, ethereum);

      const res = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });
      const resjwt = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVC.proof.jwt,
        store: ['snap'],
      });
      const res2 = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVCJSONLD,
        store: ['snap'],
      });

      const res3 = await veramoSaveVC({
        snap: snapMock,
        ethereum,
        verifiableCredential: exampleVCEIP712,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        {
          proofFormat: 'jwt',
          vcs: [
            { id: res[0].id, metadata: { store: 'snap' } },
            { id: resjwt[0].id, metadata: { store: 'snap' } },
            { id: res2[0].id, metadata: { store: 'snap' } },
            { id: res3[0].id, metadata: { store: 'snap' } },
          ],
        }
      );
      expect(createdVP).not.toBeNull();

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(createdVP?.verifiableCredential).toStrictEqual([
        exampleVCinVP,
        exampleVCinVP,
        exampleVCJSONLD,
        exampleVCEIP712,
      ]);

      expect(verifyResult.verified).toBe(true);

      expect.assertions(3);
    });

    it('should fail creating a VP and return null - no VC found', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(true);

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }] }
      );

      expect(createdVP).toBeNull();

      expect.assertions(1);
    });

    it('should fail creating a VP and return null - user rejected', async () => {
      const initialState = getDefaultSnapState();
      snapMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      snapMock.rpcMocks.snap_dialog.mockResolvedValue(false);

      const createdVP = await veramoCreateVP(
        {
          snap: snapMock,
          ethereum,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }] }
      );

      expect(createdVP).toBeNull();

      expect.assertions(1);
    });
  });
});
