import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
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
import { VerifiablePresentation } from '@veramo/core';

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
    });
  });

  describe('veramoListVCs', () => {
    it('should succeed listing all VCs from snap store - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await expect(veramoListVCs(walletMock, 'snap')).resolves.toEqual([]);
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
    });

    it('should succeed listing all VCs from snap store matching query - empty result', async () => {
      walletMock.rpcMocks.snap_manageState.mockReturnValue(
        getDefaultSnapState()
      );

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      await expect(
        veramoListVCs(walletMock, 'snap', { id: 'wrong-id' })
      ).resolves.toEqual([]);
    });
  });

  describe('veramoImportMetaMaskAccount', () => {
    it('should succeed importing metamask account', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).resolves.toEqual(exampleDID);

      const agent = await getAgent(walletMock);
      await expect(agent.didManagerGet({ did: exampleDID })).resolves.toEqual(
        exampleImportedDIDWIthoutPrivateKey
      );
    });

    it('should succeed importing metamask account when DID already exists', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockResolvedValue(initialState);

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).resolves.toEqual(exampleDID);

      const agent = await getAgent(walletMock);
      await expect(agent.didManagerGet({ did: exampleDID })).resolves.toEqual(
        exampleImportedDIDWIthoutPrivateKey
      );

      await expect(
        veramoImportMetaMaskAccount(walletMock, initialState, address)
      ).resolves.toEqual(exampleDID);

      const dids = await agent.didManagerFind();
      expect(dids.length).toBe(1);
    });
  });

  describe('veramoCreateVP', () => {
    it('should succeed generating a valid VP', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);
      const agent = await getAgent(walletMock);

      await veramoSaveVC(walletMock, exampleVC, 'snap');

      const createdVP = await veramoCreateVP(
        walletMock,
        initialState,
        address,
        'test-id'
      );

      expect(createdVP).not.toEqual(null);

      const verifyResult = await agent.verifyPresentationEIP712({
        presentation: createdVP as VerifiablePresentation,
      });

      expect(verifyResult).toBe(true);

      expect.assertions(2);
    });

    it('should fail generating a VP and return null - no VC found', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(true);

      const createdVP = await veramoCreateVP(
        walletMock,
        initialState,
        address,
        'test-id'
      );

      expect(createdVP).toEqual(null);

      expect.assertions(1);
    });

    it('should fail generating a VP and return null - user rejected', async () => {
      const initialState = getDefaultSnapState();
      walletMock.rpcMocks.snap_manageState.mockReturnValue(initialState);
      walletMock.rpcMocks.snap_confirm.mockResolvedValue(false);

      const createdVP = await veramoCreateVP(
        walletMock,
        initialState,
        address,
        'test-id'
      );

      expect(createdVP).toEqual(null);

      expect.assertions(1);
    });
  });
});
