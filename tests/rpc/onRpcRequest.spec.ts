import { SnapProvider } from '@metamask/snap-types';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';
import { onRpcRequest } from '../../src/index';
import {
  exampleDID,
  exampleDIDKey,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import { availableVCStores } from '../../src/veramo/plugins/availableVCStores';
import { availableMethods } from '../../src/did/didMethods';
import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import * as uuid from 'uuid';
import { getAgent } from '../../src/veramo/setup';
jest.mock('uuid');

describe('onRpcRequest', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
    walletMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    global.wallet = walletMock;
  });

  describe('saveVC', () => {
    it('should succeed saving 1 VC and return true', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
            },
          },
        })
      ).resolves.toEqual(true);

      const result = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVCs',
          params: {
            query: {},
          },
        },
      })) as VerifiableCredential[];

      const removedKeys = result.map((vc) => {
        delete vc.key;
        return vc;
      });

      expect(removedKeys).toEqual([exampleVC]);

      expect.assertions(2);
    });

    it('should fail saving VC and return false - user denied', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
            },
          },
        })
      ).resolves.toBe(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVCs',
            params: {
              query: {},
            },
          },
        })
      ).resolves.toEqual([]);

      expect.assertions(2);
    });
  });

  describe('getVCs', () => {
    it('should succeed with empty array', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVCs',
            params: {
              query: {},
            },
          },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
          },
        },
      });

      const expectedResult = [{ ...exampleVC, key: 'test-id' }];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVCs',
            params: {
              query: {
                key: 'test-id',
              },
            },
          },
        })
      ).resolves.toEqual(expectedResult);
    });

    expect.assertions(1);
  });

  describe('getVP', () => {
    it('should succeed creating VP', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);
      const agent = await getAgent(walletMock);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
          },
        },
      });

      const createdVP = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVP',
          params: {
            vcId: 'test-id',
          },
        },
      })) as VerifiablePresentation;

      expect(createdVP).not.toEqual(null);

      const verifyResult = await agent.verifyPresentationEIP712({
        presentation: createdVP,
      });

      expect(verifyResult).toBe(true);

      expect.assertions(2);
    });

    it('should succeed creating VP with did:key', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);
      const agent = await getAgent(walletMock);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
          },
        },
      });

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchMethod',
          params: { didMethod: 'did:key' },
        },
      });

      const createdVP = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVP',
          params: {
            vcId: 'test-id',
          },
        },
      })) as VerifiablePresentation;

      expect(createdVP).not.toEqual(null);

      const verifyResult = await agent.verifyPresentationEIP712({
        presentation: createdVP,
      });

      expect(verifyResult).toBe(true);

      expect.assertions(2);
    });

    it('should fail creating VP and return null - user denied', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
          },
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVP',
            params: {
              vcId: 'test-id',
            },
          },
        })
      ).resolves.toBe(null);

      expect.assertions(1);
    });

    it('should fail creating VP - VC does not exist', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getVP',
            params: {
              vcId: 'test-id',
            },
          },
        })
      ).resolves.toBe(null);

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
    });
  });

  describe('getDID', () => {
    it('should succeed returning current did (did:ethr)', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getDID',
            params: {},
          },
        })
      ).resolves.toEqual(exampleDID);

      expect.assertions(1);
    });

    it('should succeed returning current did (did:key)', async () => {
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
            method: 'getDID',
            params: {},
          },
        })
      ).resolves.toEqual(exampleDIDKey);

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
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

      expect.assertions(1);
    });
  });

  describe('setVCStore', () => {
    it('should succeed toggling store to ceramic', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
          },
        })
      ).resolves.toBe(true);

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

      expect.assertions(2);
    });

    it('should succeed toggling store to ceramic and back to snap', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
          },
        })
      ).resolves.toBe(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
          },
        })
      ).resolves.toBe(true);

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

      expect.assertions(3);
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

      expect.assertions(1);
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

      expect.assertions(1);
    });
  });
});
