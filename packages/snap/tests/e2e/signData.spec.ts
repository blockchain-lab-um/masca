import {
  methodIndexMapping,
  SignJWTParams,
  SignJWZParams,
} from '@blockchain-lab-um/masca-types';
import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { bytesToBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { HDNodeWallet, Mnemonic } from 'ethers';
import { importJWK, JWK, jwtVerify } from 'jose';
import cloneDeep from 'lodash.clonedeep';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const { ec: EC } = elliptic;

const EXAMPLE_JWT_HEADER_AND_PAYLOAD = {
  payload: {
    aud: 'test-audience',
  },
  header: {
    testKey: 'testValue',
  },
};

const JWT_TEST_CASES = [
  // Test DID Methods
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: cloneDeep(EXAMPLE_JWT_HEADER_AND_PAYLOAD),
    } as SignJWTParams,
    size: 0,
  },
  {
    method: 'did:key:jwk_jcs-pub',
    input: {
      type: 'JWT',
      data: cloneDeep(EXAMPLE_JWT_HEADER_AND_PAYLOAD),
    } as SignJWTParams,
    size: 0,
  },
  // Test if exp, nbf, iat and typ are correctly set
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
          exp: 16961899224790,
          nbf: 123456789,
          iat: 123456789,
        },
        header: {
          typ: 'openid4vci-proof+jwt',
          testKey: 'testValue',
        },
      },
    } as SignJWTParams,
    size: 0,
  },
  // Test with large data (1MB)
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
          customData: 'a'.repeat(1024 * 1024),
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
    } as SignJWTParams,
    size: 1024 * 1024,
  },
  {
    method: 'did:key:jwk_jcs-pub',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
          customData: 'a'.repeat(1024 * 1024),
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
    } as SignJWTParams,
    size: 1024 * 1024,
  },
  // Test with large data (10MB)
  {
    method: 'did:key',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
          customData: 'a'.repeat(1024 * 1024 * 10),
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
    } as SignJWTParams,
    size: 1024 * 1024 * 10,
  },
  {
    method: 'did:key:jwk_jcs-pub',
    input: {
      type: 'JWT',
      data: {
        payload: {
          aud: 'test-audience',
          customData: 'a'.repeat(1024 * 1024 * 10),
        },
        header: {
          typ: 'JWT',
          testKey: 'testValue',
        },
      },
    } as SignJWTParams,
    size: 1024 * 1024 * 10,
  },
];

const JWZ_TEST_CASES = [
  // Test Polygon mainnet
  {
    method: 'did:polygonid',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: {
        data: 'TestData123',
      },
    } as SignJWZParams,
    size: 11,
  },
  {
    method: 'did:iden3',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: {
        data: 'TestData123',
      },
    } as SignJWZParams,
    size: 11,
  },
  // Test Polygon testnet
  {
    method: 'did:polygonid',
    network: '0x13881',
    input: {
      type: 'JWZ',
      data: {
        data: 'TestData123',
      },
    } as SignJWZParams,
    size: 11,
  },
  {
    method: 'did:iden3',
    network: '0x13881',
    input: {
      type: 'JWZ',
      data: {
        data: 'TestData123',
      },
    } as SignJWZParams,
    size: 11,
  },
  // Test with large data (1MB)
  {
    method: 'did:polygonid',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: { data: 'a'.repeat(1024 * 1024) },
    } as SignJWZParams,
    size: 1024 * 1024,
  },
  // Test with large data (10MB)
  {
    method: 'did:polygonid',
    network: '0x89',
    input: {
      type: 'JWZ',
      data: { data: 'a'.repeat(1024 * 1024 * 10) },
    } as SignJWZParams,
    size: 1024 * 1024 * 10,
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

  /**
   * Test JWT
   */
  it.each(JWT_TEST_CASES)(
    'should successfully sign JWT with $method and size $size bytes',
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
      })) as Result<string>;

      if (isError(signedData)) {
        throw new Error(signedData.error);
      }

      const entropy = snapMock.rpcMocks.snap_getEntropy({
        version: '1',
        salt: account,
      });

      const nodeWallet = HDNodeWallet.fromMnemonic(
        Mnemonic.fromEntropy(entropy)
      ).derivePath(`m/44/1236/${methodIndexMapping[testCase.method]}/0/0`);

      const curveName =
        testCase.method === 'did:key:jwk_jcs-pub' ? 'p256' : 'secp256k1';
      const ctx = new EC(curveName);

      const privateKey = ctx.keyFromPrivate(
        nodeWallet.privateKey.slice(2),
        'hex'
      );

      const pubPoint = privateKey.getPublic();

      const publicKeyJwk: JWK = {
        kty: 'EC',
        crv: curveName === 'p256' ? 'P-256' : 'secp256k1',
        x: bytesToBase64url(pubPoint.getX().toBuffer('be', 32)),
        y: bytesToBase64url(pubPoint.getY().toBuffer('be', 32)),
      };

      const publicKey = await importJWK(
        publicKeyJwk,
        testCase.method === 'did:key:jwk_jcs-pub' ? 'ES256' : 'ES256K'
      );

      const { payload, protectedHeader } = await jwtVerify(
        signedData.data,
        publicKey
      );

      if (testCase.input.data?.payload?.exp) {
        expect(payload.exp).toBe(testCase.input.data.payload.exp);
        expect(payload.nbf).toBe(testCase.input.data.payload.nbf);
        expect(payload.iat).toBe(testCase.input.data.payload.iat);
      }

      if (testCase.input.data?.payload?.customData) {
        expect(payload.customData).toBe(testCase.input.data.payload.customData);
      }

      expect(protectedHeader.typ).toBe(
        testCase.input.data?.header?.typ ?? 'JWT'
      );
      expect(payload.aud).toBe(testCase.input.data?.payload?.aud);
    }
  );

  /**
   * Test JWZ
   */
  it.each(JWZ_TEST_CASES)(
    'should successfully sign JWZ with $method and size $size bytes',
    async (testCase) => {
      // Change mocked chainId value
      snapMock.rpcMocks.eth_chainId.mockResolvedValue(testCase.network);
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(account),
      });

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
      })) as Result<string>;

      if (isError(signedData)) {
        throw new Error(signedData.error);
      }

      expect(signedData.data).toBeDefined();
    }
  );

  /**
   * Unsupported DID method
   */
  it('should return an error if the DID method is not supported', async () => {
    const switchMethod = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: {
          didMethod: 'did:ethr',
        },
      },
    })) as Result<string>;

    if (isError(switchMethod)) {
      throw new Error(switchMethod.error);
    }

    let signedData = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signData',
        params: {
          type: 'JWT',
          data: {
            payload: {
              aud: 'test-audience',
            },
            header: {
              testKey: 'testValue',
            },
          },
        },
      },
    })) as Result<string>;

    if (isSuccess(signedData)) {
      throw new Error('Should return an error');
    }

    expect(signedData.error).toBe('Error: Unsupported DID method');

    signedData = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signData',
        params: {
          type: 'JWZ',
          data: {
            data: 'TestData123',
          },
        },
      },
    })) as Result<string>;

    if (isSuccess(signedData)) {
      throw new Error('Should return an error');
    }

    expect(signedData.error).toBe('Error: Unsupported DID method');
  });
});
