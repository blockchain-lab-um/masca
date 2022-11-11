import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  bip44Entropy,
  exampleDID,
  exampleImportedDIDWIthoutPrivateKey,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import {
  veramoCreateVP,
  veramoImportMetaMaskAccount,
  veramoListVCs,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { getAgent } from '../../src/veramo/setup';
import { IVerifyResult, VerifiablePresentation } from '@veramo/core';
import { BIP44CoinTypeNode } from '@metamask/key-tree/dist/BIP44CoinTypeNode';

jest.mock('uuid', () => ({ v4: () => 'test-id' }));

describe('Utils [veramo]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('veramoSaveVC', () => {
    it('should succeed saving VC in snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(veramoSaveVC(walletMock, exampleVC, 'snap')).resolves.toBe(
        true
      );

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].vcs['test-id'] = exampleVC;

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenLastCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
  });

  describe('veramoListVCs', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(veramoListVCs(walletMock, 'snap')).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      const expectedVC = { ...exampleVC, key: 'test-id' };
      await expect(veramoListVCs(walletMock, 'snap')).resolves.toEqual([
        expectedVC,
      ]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty query', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      const expectedVC = { ...exampleVC, key: 'test-id' };
      await expect(veramoListVCs(walletMock, 'snap', {})).resolves.toEqual([
        expectedVC,
      ]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      const expectedVC = { ...exampleVC, key: 'test-id' };
      await expect(
        veramoListVCs(walletMock, 'snap', {
          key: 'test-id',
        })
      ).resolves.toEqual([expectedVC]);

      expect.assertions(1);
    });

    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      await expect(
        veramoListVCs(walletMock, 'snap', { id: 'wrong-id' })
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
              bip44Node: bip44Entropy as BIP44CoinTypeNode,
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
              bip44Node: bip44Entropy as BIP44CoinTypeNode,
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
              bip44Node: bip44Entropy as BIP44CoinTypeNode,
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

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      const createdVP = await veramoCreateVP(
        {
          wallet: walletMock,
          state: initialState,
          account: address,
          bip44Node: bip44Entropy as BIP44CoinTypeNode,
        },
        'test-id'
      );
      expect(createdVP).not.toEqual(null);

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP as VerifiablePresentation,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

      expect.assertions(2);
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
          bip44Node: bip44Entropy as BIP44CoinTypeNode,
        },
        'test-id'
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
          bip44Node: bip44Entropy as BIP44CoinTypeNode,
        },
        'test-id'
      );

      expect(createdVP).toEqual(null);

      expect.assertions(1);
    });
  });
});
