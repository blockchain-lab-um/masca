import { SnapProvider } from '@metamask/snap-types';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';
import { onRpcRequest } from '../../src/index';
import { getDefaultSnapState } from '../testUtils/constants';
import { availableVCStores } from '../../src/veramo/plugins/availableVCStores';
import { availableMethods } from '../../src/did/didMethods';

describe('onRpcRequest', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
    walletMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.wallet = walletMock;
  });

  describe('getVCs', () => {
    it('', async () => {
      // await onRpcRequest({
      //   origin: 'localhost',
      //   request: {
      //     id: 'test-id',
      //     jsonrpc: '2.0',
      //     method: 'getVCs',
      //   },
      // });
    });
  });

  describe('getVP', () => {
    it('', async () => {
      // await onRpcRequest({
      //   origin: 'localhost',
      //   request: { id: 'test-id', jsonrpc: '2.0', method: 'getVP', params: {} },
      // });
    });
  });

  describe('changeInfuraToken', () => {
    it('should succeed changing infura token and return true', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'changeInfuraToken',
            params: {
              infuraToken: 'test-token',
            },
          },
        })
      ).resolves.toBe(true);
    });

    it('should fail changing infura token and return false', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'changeInfuraToken',
            params: {
              infuraToken: 'test-token',
            },
          },
        })
      ).resolves.toBe(false);
    });
  });

  describe('togglePopups', () => {
    it('should succeed toggling popups and return true', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'togglePopups',
            params: {},
          },
        })
      ).resolves.toBe(true);
    });

    it('should fail toggling popups and return false', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'togglePopups',
            params: {},
          },
        })
      ).resolves.toBe(false);
    });
  });

  describe('getDID', () => {
    it('', async () => {
      // await onRpcRequest({
      //   origin: 'localhost',
      //   request: {
      //     id: 'test-id',
      //     jsonrpc: '2.0',
      //     method: 'getDID',
      //     params: {},
      //   },
      // });
    });
  });

  describe('switchMethod', () => {
    it('should succeed switching method to did:key and return true', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchMethod',
            params: {
              didMethod: 'did:key',
            },
          },
        })
      ).resolves.toBe(true);
    });

    it('should fail switching method to did:key and return false', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchMethod',
            params: {
              didMethod: 'did:key',
            },
          },
        })
      ).resolves.toBe(false);
    });
  });

  describe('getMethod', () => {
    it('should succeed and return did:ethr', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getMethod',
            params: {},
          },
        })
      ).resolves.toEqual('did:ethr');
    });

    it('should succeed and return did:key', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchMethod',
          params: {
            didMethod: 'did:key',
          },
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getMethod',
            params: {},
          },
        })
      ).resolves.toEqual('did:key');
    });
  });

  describe('getAvailableMethods', () => {
    it('should succeed and return available methods', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getAvailableMethods',
          },
        })
      ).resolves.toEqual(availableMethods);
    });
  });

  describe('setVCStore', () => {
    it('', async () => {
      // await expect(onRpcRequest({
      //   origin: 'localhost',
      //   request: {
      //     id: 'test-id',
      //     jsonrpc: '2.0',
      //     method: 'setVCStore',
      //     params: {},
      //   },
      // })).resolves;
    });
  });

  describe('getVCStore', () => {
    it('should succeed and return snap', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVCStore',
          },
        })
      ).resolves.toEqual('snap');
    });

    it('should succeed and return ceramic', async () => {
      // FIXME: Update after updaing setVCStore
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVCStore',
          },
        })
      ).resolves.toEqual('ceramic');
    });
  });

  describe('getAvailableVCStores', () => {
    it('should succeed and return available VC stores', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getAvailableVCStores',
          },
        })
      ).resolves.toEqual(availableVCStores);
    });
  });
});
