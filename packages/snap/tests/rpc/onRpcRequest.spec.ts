import { SnapProvider } from '@metamask/snap-types';
import { createMockWallet, WalletMock } from '../testUtils/wallet.mock';
import { onRpcRequest } from '../../src/index';
import {
  exampleDID,
  exampleDIDKey,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import { availableVCStores, availableMethods } from '../../src/constants/index';
import {
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';
import * as uuid from 'uuid';
import { getAgent } from '../../src/veramo/setup';
import { address } from '../testUtils/constants';
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
              store: 'snap',
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

    it('should succeed saving 1 VC without store param and return true', async () => {
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
              store: 'snap',
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

    it('should throw error because store is not supported', async () => {
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
              store: 'snapp',
            },
          },
        })
      ).rejects.toThrow('Store is not supported!');

      expect.assertions(1);
    });
    it('should throw error because request is not valid', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              store: 'snap',
            },
          },
        })
      ).rejects.toThrow('Invalid SaveVC request');

      expect.assertions(1);
    });

    it('should throw error because request is not valid: store format', async () => {
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
              store: 123,
            },
          },
        })
      ).rejects.toThrow('Store is invalid format');

      expect.assertions(1);
    });
    it('should throw error because request is not valid: store not supported in array', async () => {
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
              store: ['snap', 'snapp'],
            },
          },
        })
      ).rejects.toThrow('Store is not supported!');

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              store: [],
            },
          },
        })
      ).rejects.toThrow('Store is invalid format');

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
            store: 'snap',
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
      expect.assertions(1);
    });
  });

  describe('createVP', () => {
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
            store: 'snap',
          },
        },
      });

      const createdVP = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ id: 'test-id' }],
          },
        },
      })) as VerifiablePresentation;

      expect(createdVP).not.toEqual(null);

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

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
            store: 'snap',
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
          method: 'createVP',
          params: {
            vcs: [{ id: 'test-id' }],
          },
        },
      })) as VerifiablePresentation;

      expect(createdVP).not.toEqual(null);

      const verifyResult = (await agent.verifyPresentation({
        presentation: createdVP,
      })) as IVerifyResult;

      expect(verifyResult.verified).toBe(true);

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
            store: 'snap',
          },
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createVP',
            params: {
              vcs: [{ id: 'test-id' }],
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
            method: 'createVP',
            params: {
              vcs: [{ id: 'test-id' }],
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
      ).resolves.toBe(
        'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik'
      );

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
      ).resolves.toBe('');

      expect.assertions(1);
    });

    it('should fail switching method because method is not supported', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchMethod',
            params: {
              didMethod: 'did:keyy',
            },
          },
        })
      ).rejects.toThrow('Method is not supported!');

      expect.assertions(1);
    });
    it('should fail switching method because request is bad', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchMethod',
            params: {},
          },
        })
      ).rejects.toThrow('Invalid switchMethod request.');

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
    it('should throw and error when using wrong vcStore', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
            params: { store: 'ceramicc', value: true },
          },
        })
      ).rejects.toThrow('Store is not supported!');

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
            params: { store: 'ceramic', value: 'tlo' },
          },
        })
      ).rejects.toThrow('Invalid setVCStore request.');
      expect.assertions(2);
    });

    it('should succeed toggling ceramic store to true', async () => {
      walletMock.rpcMocks.snap_confirm.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setVCStore',
            params: { store: 'ceramic', value: true },
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
      ).resolves.toEqual({ ceramic: true, snap: true });

      expect.assertions(2);
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
      ).resolves.toEqual({ ceramic: false, snap: true });
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
  describe('getAccountSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return available methods', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getAccountSettings',
          },
        })
      ).resolves.toEqual(state.accountState[address].accountConfig);

      expect.assertions(1);
    });
  });
  describe('getSnapSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return available methods', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getSnapSettings',
          },
        })
      ).resolves.toEqual(state.snapConfig);

      expect.assertions(1);
    });
  });
});
