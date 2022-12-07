import { SnapsGlobalObject } from '@metamask/snaps-types';
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
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

describe('Utils [did]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  describe('changeCurrentVCStore', () => {
    it("should succeed setting VC store to 'snap'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentVCStore(snapMock, initialState, address, 'snap', true)
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
        changeCurrentVCStore(snapMock, initialState, address, 'ceramic', true)
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].accountConfig.ssi.vcStore['ceramic'] =
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

      await expect(
        getCurrentDid(snapMock, initialState, address)
      ).resolves.toBe(`did:ethr:0x5:${address}`);

      expect.assertions(1);
    });

    it('should return did:key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      await expect(
        getCurrentDid(snapMock, initialState, address)
      ).resolves.toBe(exampleDIDKey);

      expect.assertions(1);
    });
  });

  describe('changeCurrentMethod', () => {
    it("should succeed setting DID method to 'did:ethr'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentMethod(snapMock, initialState, address, 'did:key')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });

    it("should succeed setting DID method to 'did:key'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentMethod(snapMock, initialState, address, 'did:key')
      ).resolves.not.toThrow();

      const expectedState = getDefaultSnapState();
      expectedState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
        operation: 'update',
        newState: expectedState,
      });

      expect.assertions(2);
    });
  });
});
