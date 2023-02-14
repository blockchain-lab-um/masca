import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  availableVCStores,
  availableMethods,
} from '@blockchain-lab-um/ssi-snap-types';
import { DIDResolutionResult, VerifiablePresentation } from '@veramo/core';
import * as uuid from 'uuid';
import { DIDDataStore } from '@glazed/did-datastore';
import { StreamID } from '@ceramicnetwork/streamid';
import { veramoClearVCs } from '../../src/utils/veramoUtils';
import {
  exampleDID,
  exampleDIDKey,
  exampleDIDJwk,
  exampleVC,
  getDefaultSnapState,
  jsonPath,
  address,
  exampleDIDDocument,
} from '../testUtils/constants';
import { StoredCredentials } from '../../src/interfaces';
import * as snapUtils from '../../src/utils/snapUtils';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';
import { onRpcRequest } from '../../src/index';

jest.mock('uuid');
let ceramicData: StoredCredentials;
jest
  .spyOn(DIDDataStore.prototype, 'get')
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  .mockImplementation(async (key, did?) => {
    return ceramicData;
  });
jest
  .spyOn(DIDDataStore.prototype, 'merge')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  .mockImplementation(async (key, content, options?) => {
    ceramicData = content as StoredCredentials;
    return 'ok' as unknown as StreamID;
  });

jest
  .spyOn(snapUtils, 'getCurrentAccount')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => address);

jest
  .spyOn(snapUtils, 'getCurrentNetwork')
  // eslint-disable-next-line @typescript-eslint/require-await
  .mockImplementation(async () => '0x5');

describe('onRpcRequest', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState('update', getDefaultSnapState());
    // snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  describe('saveVC', () => {
    it('should succeed saving 1 VC and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 'snap' },
            },
          },
        })
      ).resolves.toEqual([{ id: undefined, store: 'snap' }]);

      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {},
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'undefined', store: 'snap' },
        },
      ];

      expect(result).toEqual(expectedResult);

      expect.assertions(2);
    });

    it('should succeed saving 1 VC without store param and return id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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
      ).resolves.toEqual([{ id: undefined, store: 'snap' }]);

      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'undefined', store: 'snap' },
        },
      ];

      expect(result).toEqual(expectedResult);

      expect.assertions(2);
    });

    it('should succeed saving 1 VC in Snap & Ceramic', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(),
      });
      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: 'ceramic',
      });
      snapMock.rpcMocks.snap_manageState({
        operation: 'clear',
      });
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: ['snap', 'ceramic'] },
            },
          },
        })
      ).resolves.toEqual([
        { id: undefined, store: 'snap' },
        { id: undefined, store: 'ceramic' },
      ]);
      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'undefined', store: 'snap' },
        },
        {
          data: exampleVC,
          metadata: { id: 'undefined', store: 'ceramic' },
        },
      ];

      expect(result).toEqual(expectedResult);
      await veramoClearVCs({
        snap: snapMock,
        ethereum,
        store: 'ceramic',
      });
      expect.assertions(2);
    });

    // it('should fail saving VC and return false - user denied', async () => {
    //   snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

    //   await expect(
    //     onRpcRequest({
    //       origin: 'localhost',
    //       request: {
    //         id: 'test-id',
    //         jsonrpc: '2.0',
    //         method: 'saveVC',
    //         params: {
    //           verifiableCredential: exampleVC,
    //           options: { store: 'snap' },
    //         },
    //       },
    //     })
    //   ).rejects.toThrow('User rejected');

    //   await expect(
    //     onRpcRequest({
    //       origin: 'localhost',
    //       request: {
    //         id: 'test-id',
    //         jsonrpc: '2.0',
    //         method: 'queryVCs',
    //         params: {
    //           query: {},
    //         },
    //       },
    //     })
    //   ).resolves.toEqual([]);

    //   expect.assertions(2);
    // });

    it('should throw error because store is not supported', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 'snapp' },
            },
          },
        })
      ).rejects.toThrow('Store is not supported!');

      expect.assertions(1);
    });
    it('should throw error because request is not valid', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              options: { store: 'snap' },
            },
          },
        })
      ).rejects.toThrow('Invalid SaveVC request');

      expect.assertions(1);
    });

    it('should throw error because request is not valid: store format', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 123 },
            },
          },
        })
      ).rejects.toThrow('Store is invalid format');

      expect.assertions(1);
    });
    it('should throw error because request is not valid: store not supported in array', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: ['snap', 'snapp'] },
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
              options: { store: [] },
            },
          },
        })
      ).rejects.toThrow('Store is invalid format');

      expect.assertions(2);
    });
  });

  describe('queryVCs', () => {
    it('should succeed with empty array', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {},
          },
        })
      ).resolves.toEqual([]);

      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - filter by ID', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'test-id', store: 'snap' },
        },
      ];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {
              filter: {
                type: 'id',
                filter: 'test-id',
              },
            },
          },
        })
      ).resolves.toEqual(expectedResult);
      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - no filter or store', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'test-id', store: 'snap' },
        },
      ];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {},
          },
        })
      ).resolves.toEqual(expectedResult);
      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - store defined', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'test-id', store: 'snap' },
        },
      ];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {
              options: { store: 'snap' },
            },
          },
        })
      ).resolves.toEqual(expectedResult);
      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - without store', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'test-id' },
        },
      ];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {
              options: { returnStore: false },
            },
          },
        })
      ).resolves.toEqual(expectedResult);
      expect.assertions(1);
    });

    it('should succeed with 1 VC matching query - filter by JSONPath', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      const expectedResult = [
        {
          data: exampleVC,
          metadata: { id: 'test-id', store: 'snap' },
        },
      ];

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'queryVCs',
            params: {
              options: { store: 'snap' },
              filter: {
                type: 'JSONPath',
                filter: jsonPath,
              },
            },
          },
        })
      ).resolves.toEqual(expectedResult);
      expect.assertions(1);
    });
  });

  describe('deleteVC', () => {
    it('should succeed saving and deleting 1 VC', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 'snap' },
            },
          },
        })
      ).resolves.toEqual([{ id: undefined, store: 'snap' }]);

      const res = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'deleteVC',
          params: {
            id: 'undefined',
          },
        },
      });

      expect(res).toEqual([true]);
      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      });

      expect(result).toHaveLength(0);

      expect.assertions(3);
    });

    it('should succeed saving and deleting 1 VC with store', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 'snap' },
            },
          },
        })
      ).resolves.toEqual([{ id: undefined, store: 'snap' }]);

      const res = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'deleteVC',
          params: {
            id: 'undefined',
            options: { store: 'snap' },
          },
        },
      });

      expect(res).toEqual([true]);

      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      });

      expect(result).toHaveLength(0);

      expect.assertions(3);
    });
    it('should fail deleting 1 VC with wrong id', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'saveVC',
            params: {
              verifiableCredential: exampleVC,
              options: { store: 'snap' },
            },
          },
        })
      ).resolves.toEqual([{ id: undefined, store: 'snap' }]);

      const res = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'deleteVC',
          params: {
            id: 'wrong_id',
            options: { store: 'snap' },
          },
        },
      });

      expect(res).toHaveLength(0);

      const result = await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'queryVCs',
          params: {
            query: {},
          },
        },
      });

      expect(result).toHaveLength(1);

      expect.assertions(3);
    });
  });

  describe('createVP', () => {
    it('should succeed creating VP', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
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
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          },
        },
      })) as VerifiablePresentation;

      expect(createdVP).not.toBeNull();

      // const verifyResult = (await agent.verifyPresentation({
      //   presentation: createdVP,
      // })) as IVerifyResult;

      // expect(verifyResult.verified).toBe(true);

      expect.assertions(1);
    });

    it('should succeed creating VP with did:key', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      // const agent = await getAgent(snapMock);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
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

      expect(createdVP).not.toBeNull();

      // const verifyResult = (await agent.verifyPresentation({
      //   presentation: createdVP,
      // })) as IVerifyResult;

      // expect(verifyResult.verified).toBe(true);

      expect.assertions(1);
    });

    it('should succeed creating VP with did:jwk', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveVC',
          params: {
            verifiableCredential: exampleVC,
            options: { store: 'snap' },
          },
        },
      });

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: { didMethod: 'did:jwk' },
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

      // TODO: Verify VP
      expect(createdVP).not.toBeNull();
      expect.assertions(1);
    });

    // it('should fail creating VP and return null - user denied', async () => {
    //   jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
    //   snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

    //   await onRpcRequest({
    //     origin: 'localhost',
    //     request: {
    //       id: 'test-id',
    //       jsonrpc: '2.0',
    //       method: 'saveVC',
    //       params: {
    //         verifiableCredential: exampleVC,
    //         options: { store: 'snap' },
    //       },
    //     },
    //   });

    //   await expect(
    //     onRpcRequest({
    //       origin: 'localhost',
    //       request: {
    //         id: 'test-id',
    //         jsonrpc: '2.0',
    //         method: 'createVP',
    //         params: {
    //           vcs: [{ id: 'test-id' }],
    //         },
    //       },
    //     })
    //   ).rejects.toThrow('User rejected');

    //   expect.assertions(1);
    // });

    it('should fail creating VP - VC does not exist', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('test-id');
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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
      ).resolves.toBeNull();

      expect.assertions(1);
    });
  });

  describe('togglePopups', () => {
    it('should succeed toggling popups and return true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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

    // it('should fail toggling popups and return false', async () => {
    //   snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

    //   await expect(
    //     onRpcRequest({
    //       origin: 'localhost',
    //       request: {
    //         id: 'test-id',
    //         jsonrpc: '2.0',
    //         method: 'togglePopups',
    //         params: {},
    //       },
    //     })
    //   ).resolves.toBe(false);

    //   expect.assertions(1);
    // });
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
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
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

    it('should succeed returning current did (did:jwk)', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:jwk',
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
      ).resolves.toEqual(exampleDIDJwk);

      expect.assertions(1);
    });
  });

  describe('switchDIDMethod', () => {
    it('should succeed switching method to did:key and return true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchDIDMethod',
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

    it('should succeed switching method to did:jwk and return true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchDIDMethod',
            params: {
              didMethod: 'did:jwk',
            },
          },
        })
      ).resolves.toBe(exampleDIDJwk);

      expect.assertions(1);
    });

    // it('should fail switching method to did:key and return false', async () => {
    //   snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

    //   await expect(
    //     onRpcRequest({
    //       origin: 'localhost',
    //       request: {
    //         id: 'test-id',
    //         jsonrpc: '2.0',
    //         method: 'switchDIDMethod',
    //         params: {
    //           didMethod: 'did:key',
    //         },
    //       },
    //     })
    //   ).resolves.toBe('');

    //   expect.assertions(1);
    // });

    it('should fail switching method because method is not supported', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchDIDMethod',
            params: {
              didMethod: 'did:keyy',
            },
          },
        })
      ).rejects.toThrow('Method is not supported!');

      expect.assertions(1);
    });
    it('should fail switching method because request is bad', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(false);

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchDIDMethod',
            params: {},
          },
        })
      ).rejects.toThrow('Invalid switchDIDMethod request.');

      expect.assertions(1);
    });
  });

  describe('getSelectedMethod', () => {
    it('should succeed and return did:ethr', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getSelectedMethod',
            params: {},
          },
        })
      ).resolves.toBe('did:ethr');

      expect.assertions(1);
    });

    it('should succeed and return did:key', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
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
            method: 'getSelectedMethod',
            params: {},
          },
        })
      ).resolves.toBe('did:key');

      expect.assertions(1);
    });

    it('should succeed and return did:jwk', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: 'did:jwk',
          },
        },
      });

      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getSelectedMethod',
            params: {},
          },
        })
      ).resolves.toBe('did:jwk');

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
            params: {},
          },
        })
      ).resolves.toEqual(availableMethods);

      expect.assertions(1);
    });
  });

  describe('setVCStore', () => {
    it('should throw and error when using wrong vcStore', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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
            params: {},
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
            params: {},
          },
        })
      ).resolves.toEqual({ ceramic: true, snap: true });
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
            params: {},
          },
        })
      ).resolves.toEqual(availableVCStores);

      expect.assertions(1);
    });
  });
  describe('getAccountSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return account settings', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getAccountSettings',
            params: {},
          },
        })
      ).resolves.toEqual(state.accountState[address].accountConfig);

      expect.assertions(1);
    });
  });
  describe('getSnapSettings', () => {
    const state = getDefaultSnapState();
    it('should succeed and return snap settings', async () => {
      await expect(
        onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'getSnapSettings',
            params: {},
          },
        })
      ).resolves.toEqual(state.snapConfig);

      expect.assertions(1);
    });
  });
  describe('resolveDID', () => {
    it('should succeed resolving did:ethr', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'resolveDID',
          params: { did: exampleDID },
        },
      })) as DIDResolutionResult;
      expect(res.didDocument).toEqual(exampleDIDDocument);
      expect.assertions(1);
    });
  });
});
