import { SnapProvider } from '@metamask/snap-types';
import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import {
  address,
  exampleDID,
  exampleImportedDID,
  exampleImportedDIDWIthoutPrivateKey,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import {
  veramoImportMetaMaskAccount,
  veramoSaveVC,
} from '../../src/utils/veramoUtils';
import { getAgent } from '../../src/veramo/setup';

jest.mock('uuid', () => ({ v4: () => 'test-id' }));

/**
 * @jest-environment jsdom
 */
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

  // describe('veramoListVCs', () => {
  //   it('TODO', () => {
  //     //
  //   });
  // });

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
});
