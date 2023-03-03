import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import {
  changeCurrentMethod,
  changeCurrentVCStore,
  getCurrentDid,
  resolveDid,
} from '../../src/utils/didUtils';
import * as snapUtils from '../../src/utils/snapUtils';
import {
  address,
  exampleDID,
  exampleDIDDocument,
  exampleDIDKey,
  exampleDIDKeyDocumentUniResovler,
  getDefaultSnapState,
  resolutionInvalidDID,
  resolutionMethodNotSupported,
  resolutionNotFound,
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

describe('Utils [did]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;

  beforeEach(() => {
    snapMock = createMockSnap();
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
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
      expectedState.accountState[address].accountConfig.ssi.vcStore.ceramic =
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
        getCurrentDid(ethereumMock, initialState, address)
      ).resolves.toBe(`did:ethr:0x5:${address}`);

      expect.assertions(1);
    });

    it('should return did:key', async () => {
      const initialState = getDefaultSnapState();
      initialState.accountState[address].accountConfig.ssi.didMethod =
        'did:key';

      await expect(
        getCurrentDid(ethereumMock, initialState, address)
      ).resolves.toBe(exampleDIDKey);

      expect.assertions(1);
    });
  });

  describe('changeCurrentMethod', () => {
    it("should succeed setting DID method to 'did:ethr'", async () => {
      const initialState = getDefaultSnapState();

      await expect(
        changeCurrentMethod(
          snapMock,
          ethereumMock,
          initialState,
          address,
          'did:key'
        )
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
        changeCurrentMethod(
          snapMock,
          ethereumMock,
          initialState,
          address,
          'did:key'
        )
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

    describe('resolveDID', () => {
      it('should succeed resolving did:ethr identifier', async () => {
        const didDoc = await resolveDid(exampleDID);
        expect(didDoc.didDocument).toEqual(exampleDIDDocument);
        expect.assertions(1);
      });
      it('should succeed resolving did:key identifier', async () => {
        const didDoc = await resolveDid(exampleDIDKey);
        expect(didDoc.didDocument).toEqual(exampleDIDKeyDocumentUniResovler);
        expect.assertions(1);
      });
      it('should resolve invalid did', async () => {
        const didDoc = await resolveDid('did:ethr:0x5:0x123');
        expect(didDoc).toEqual(resolutionInvalidDID);
        expect.assertions(1);
      });
      it('should resolve nonExisting did', async () => {
        const didDoc = await resolveDid('did:key:zQ3shW537');
        expect(didDoc).toEqual(resolutionNotFound);
        expect.assertions(1);
      });
      it('should resolve methodNotSupported', async () => {
        const didDoc = await resolveDid('did:keyclopse:zQ3shW537');
        expect(didDoc).toEqual(resolutionMethodNotSupported);
        expect.assertions(1);
      });
    });
  });
});
