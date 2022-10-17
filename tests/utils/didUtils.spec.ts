import { SnapProvider } from '@metamask/snap-types';
import {
  changeCurrentMethod,
  changeCurrentVCStore,
  getCurrentDid,
} from '../../src/utils/didUtils';
import {
  address,
  exampleDIDKey,
  getDefaultSnapState,
} from '../testUtils/constants';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';

describe('Utils [did]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  describe('changeCurrentVCStore', () => {
    it("should succeed setting VC store to 'snap'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentVCStore(walletMock, initialState, address, 'snap')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });

    it("should succeed setting VC store to 'ceramic'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentVCStore(walletMock, initialState, address, 'ceramic')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].accountConfig.ssi.vcStore = 'ceramic';

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
  });

  describe('getCurrentDid', () => {
    it('should return did:ethr', async () => {
      const initialState = getDefaultSnapState();

      await expect(
        getCurrentDid(walletMock, initialState, address)
      ).resolves.toBe(`did:ethr:0x5:${address}`);

      expect.assertions(1);
    });

    it('should return did:key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      await expect(
        getCurrentDid(walletMock, initialState, address)
      ).resolves.toBe(exampleDIDKey);

      expect.assertions(1);
    });
  });

  describe('changeCurrentMethod', () => {
    it("should succeed setting DID method to 'did:ethr'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentMethod(walletMock, initialState, address, 'did:ethr')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });

    it("should succeed setting DID method to 'did:key'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentMethod(walletMock, initialState, address, 'did:key')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
        'update',
        expectedState
      );

      expect.assertions(2);
    });
  });
});
