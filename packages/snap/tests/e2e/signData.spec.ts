import { SignJWTParams, SignJWZParams } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const testCases = [
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
      options: {
        hash: 'sha256',
      }
    }as SignJWTParams,
  },
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
      options: {
        hash: 'keccak',
      }
    } as SignJWTParams,
  },
  {
    method: 'did:jwk',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
      options: {
        hash: 'sha256',
      }
    }as SignJWTParams,
  },
  {
    method: 'did:key:jwk_jcs-pub',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
      options: {
        hash: 'sha256',
      }
    } as SignJWTParams,
  },
  {
    method: 'did:polygonid',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: "TestData123",
    } as SignJWZParams,
  },
  {
    method: 'did:polygonid',
    network: '0x13881',
    input: {
      type: 'JWZ',
      data: "TestData123",
    } as SignJWZParams,
  },
  {
    method: 'did:iden',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: "TestData123",
    } as SignJWZParams,
  },
];

describe('signData', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let currentMethod: string;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it.each(testCases)(
    'should successfully sign data with $method',
    async (testCase) => {

      if (currentMethod !== testCase.method) {
        currentMethod = testCase.method;

        const switchMethod = (await onRpcRequest({
          origin: 'localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'switchDIDMethod',
            params: {
              didMethod: testCase.method,
            },
          },
        })) as Result<string>;

        if (isError(switchMethod)) {
          throw new Error(switchMethod.error);
        }
      }

      if(currentMethod === 'did:polygonid' || currentMethod === 'did:iden') {
        snapMock.rpcMocks.eth_chainId.mockReturnValueOnce(testCase.network);
      }

      const signedData = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'signData',
          params: {
            ...(testCase.input as any),
          },
        },
      })) as Result<unknown>;

      console.log(signedData);

      expect(signedData).toBeDefined();
    }
  );
});
