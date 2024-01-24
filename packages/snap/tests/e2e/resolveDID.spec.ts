import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { DIDResolutionResult } from 'did-resolver';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import {
  CHEQD,
  EBSI,
  ENS,
  ETHR,
  ION,
  KEY,
  WEB,
} from '../data/documentResolution';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('resolveDID', () => {
  let snapMock: SnapsProvider & SnapMock;

  const methods = [EBSI, ENS, ION, CHEQD, WEB, ETHR, KEY] as const;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it.each(methods)(
    'should resolve a $didResolutionMetadata.did.method method',
    async (method) => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'resolveDID',
          params: {
            did: method.did,
          },
        },
      })) as Result<DIDResolutionResult>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data.didDocument).toEqual(method.didDocument);
      expect(res.data.didDocumentMetadata).toEqual(method.didDocumentMetadata);

      // FIXME: Resolver for did:key and did:ethr return undefined for didResolutionMetadata
      expect(res.data.didResolutionMetadata.did).toEqual(
        method.didResolutionMetadata.did.method === 'ethr' ||
          method.didResolutionMetadata.did.method === 'key'
          ? undefined
          : method.didResolutionMetadata.did
      );
      expect.assertions(3);
    }
  );

  it('should return an error if the did is not found', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'resolveDID',
        params: {
          did: 'did:web:example.com',
        },
      },
    })) as Result<DIDResolutionResult>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data.didDocument).toBeNull();
    expect(res.data.didDocumentMetadata).toEqual({});
    expect(res.data.didResolutionMetadata.error).toBe('notFound');
    expect.assertions(3);
  });
});
