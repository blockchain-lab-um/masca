import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  bip44Entropy,
  exampleDID,
  exampleImportedDIDWIthoutPrivateKey,
  exampleVC,
  exampleVCinVP,
  getDefaultSnapState,
  jsonPath,
} from '../testUtils/constants';
import {
  veramoClearVCs,
  veramoCreateVP,
  veramoDeleteVC,
  veramoImportMetaMaskAccount,
  veramoQueryVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { getAgent } from '../../src/veramo/setup';
import {
  IIdentifier,
  IVerifyResult,
  VerifiablePresentation,
} from '@veramo/core';
import { BIP44CoinTypeNode } from '@metamask/key-tree/dist/BIP44CoinTypeNode';
import { deepCopy } from 'ethers/lib/utils';

jest.mock('uuid', () => ({ v4: () => 'test-id' }));

describe('Utils [veramo]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(async () => {
    walletMock = createMockWallet();
  });

  describe('veramoSaveVC', () => {
    it('should succeed saving VC in snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
    it('should succeed saving VC in snap and ceramic store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });

      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
        {
          id: 'test-id',
          store: 'ceramic',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap', 'ceramic'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
    it('should succeed saving a JWT string in snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC.proof.jwt,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC.proof.jwt;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
    //TODO should fail saving invalid object
  });

  describe('veramoDeleteVC', () => {
    it('should succeed deleting VCs in snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      const val = await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      await veramoDeleteVC({
        wallet: walletMock,
        id: expectedResult[0].id,
        store: ['snap'],
      });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(3);
    });

    it('should succeed deleting VCs in ceramic store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });

      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
        {
          id: 'test-id',
          store: 'ceramic',
        },
      ];
      const val = await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap', 'ceramic'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const vcsPreDelete = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap', 'ceramic'], returnStore: true },
      });
      expect(vcsPreDelete).toHaveLength(2);

      await veramoDeleteVC({
        wallet: walletMock,
        id: expectedResult[1].id,
        store: ['ceramic'],
      });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { returnStore: true },
      });

      expect(vcs).toHaveLength(1);
      expect.assertions(3);
    });
    it('should succeed deleting VCs in all stores', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoClearVCs({ wallet: walletMock, store: ['ceramic'] });
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
        {
          id: 'test-id',
          store: 'ceramic',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap', 'ceramic'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      await veramoDeleteVC({
        wallet: walletMock,
        id: expectedResult[0].id,
      });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(2);
    });
  });

  describe('veramoClearVC', () => {
    it('should succeed clearing VCs in snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      await veramoClearVCs({ wallet: walletMock, store: ['snap'] });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(3);
    });
    it('should succeed clearing VCs in all stores', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      await veramoClearVCs({ wallet: walletMock });

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(0);
      expect.assertions(3);
    });
  });

  describe('veramoQueryVCs', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing JWT VC from snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );
      const expectedResult = [
        {
          id: 'test-id',
          store: 'snap',
        },
      ];
      await expect(
        veramoSaveVC({
          wallet: walletMock,
          verifiableCredential: exampleVC.proof.jwt,
          store: ['snap'],
        })
      ).resolves.toStrictEqual(expectedResult);

      const vcs = await veramoQueryVCs({
        wallet: walletMock,
        options: { store: ['snap'], returnStore: true },
      });

      expect(vcs).toHaveLength(1);
      expect(vcs[0].data).toStrictEqual(exampleVCinVP);

      expect.assertions(3);
    });

    it('should succeed listing all VCs from snap store - without returnStore', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id' },
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          options: { store: ['snap'], returnStore: false },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed querying all VCs from snap store that match JSONPath', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
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
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'snap' },
      };

      const filter = {
        type: 'JSONPath',
        filter: jsonPath,
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          filter,
          options: { store: ['snap'], returnStore: true },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty query', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'none', filter: {} },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const expectedVCObject = {
        data: exampleVC,
        metadata: { id: 'test-id', store: 'snap' },
      };
      await expect(
        veramoQueryVCs({
          wallet: walletMock,
          options: { store: ['snap'], returnStore: true },
          filter: { type: 'id', filter: 'test-id' },
        })
      ).resolves.toEqual([expectedVCObject]);

      expect.assertions(1);
    });
    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      await expect(
        veramoQueryVCs({
          wallet: walletMock,
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
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);
      const agent = await getAgent(walletMock);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              wallet: walletMock,
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
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      const agent = await getAgent(walletMock);
      expect(
        (
          await veramoImportMetaMaskAccount(
            {
              wallet: walletMock,
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
              wallet: walletMock,
              state: initialState,
              account: address,
              bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
            },
            agent
          )
        ).did
      ).toEqual(exampleDID);

      expect((await agent.didManagerFind()).length).toBe(1);

      expect.assertions(4);
    });
  });

  describe('veramoCreateVP', () => {
    it('should succeed creating a valid VP', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);
      const agent = await getAgent(walletMock);

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }] }
      );
      expect(createdVP).not.toEqual(null);

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

      expect.assertions(2);
    });
    it('should succeed creating a valid VP with 2 VCs', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);
      const agent = await getAgent(walletMock);

      await veramoSaveVC({
        wallet: walletMock,
        verifiableCredential: exampleVC,
        store: ['snap'],
      });

      const createdVP = await veramoCreateVP(
        {
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }, { id: 'test-id' }] }
      );
      expect(createdVP).not.toEqual(null);

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

    it('should fail creating a VP and return null - no VC found', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);

      const createdVP = await veramoCreateVP(
        {
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }] }
      );

      expect(createdVP).toEqual(null);

      expect.assertions(1);
    });

    it('should fail creating a VP and return null - user rejected', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(false);

      const createdVP = await veramoCreateVP(
        {
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44CoinTypeNode: bip44Entropy as BIP44CoinTypeNode,
        },
        { proofFormat: 'jwt', vcs: [{ id: 'test-id' }] }
      );

      expect(createdVP).toEqual(null);

      expect.assertions(1);
    });
  });
});
