import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionResult } from 'did-resolver';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import cheqdResolution from '../data/documentResolution/cheqdResolution.json';
import ebsiResolution from '../data/documentResolution/ebsiResolution.json';
import ensResolution from '../data/documentResolution/ensResolution.json';
import ethrResolution from '../data/documentResolution/ethrResolution.json';
import ionResolution from '../data/documentResolution/ionResolution.json';
import keyResolution from '../data/documentResolution/keyResolution.json';
import webResolution from '../data/documentResolution/webResolution.json';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('resolveDID', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  const methods = [
    ebsiResolution,
    ensResolution,
    ionResolution,
    cheqdResolution,
    webResolution,
    ethrResolution,
    keyResolution,
  ];

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
      expect(res.data.didResolutionMetadata.did).toEqual(
        method.didResolutionMetadata.did
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
    expect(res.data.didResolutionMetadata.error).toEqual('notFound');
    expect.assertions(3);
  });
});
