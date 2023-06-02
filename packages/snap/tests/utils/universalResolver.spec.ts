import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { Agent, getAgent } from '../../src/veramo/setup';
import { getDefaultSnapState } from '../testUtils/constants';
import {
  didCheqdResult,
  didEbsiResult,
  didEnsResult,
  didIonResult,
  // didPolygonidResult,
  didWebResult,
} from '../testUtils/didDocumentConstants';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';

describe('Universal Resolver', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let ethereumMock: MetaMaskInpageProvider;
  let agent: Agent;

  const methods = [
    didIonResult,
    didEnsResult,
    didEbsiResult,
    didCheqdResult,
    // didPolygonidResult,
    didWebResult,
  ];

  beforeAll(async () => {
    snapMock = createMockSnap();
    global.snap = snapMock;
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(),
    });
    ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    agent = await getAgent(snapMock, ethereumMock);
  });

  it.each(methods)(
    'should resolve a $didResolutionMetadata.did.method method',
    async (method) => {
      const res = await agent.resolveDid({
        didUrl: method.did,
      });

      expect(res.didDocument).toEqual(method.didDocument);
      expect(res.didDocumentMetadata).toEqual(method.didDocumentMetadata);
      expect(res.didResolutionMetadata.did).toEqual(
        method.didResolutionMetadata.did
      );
      expect.assertions(3);
    }
  );

  it('should return an error if the did is not found', async () => {
    const res = await agent.resolveDid({
      didUrl: 'did:web:example.com',
    });

    expect(res.didDocument).toBeNull();
    expect(res.didDocumentMetadata).toEqual({});
    expect(res.didResolutionMetadata.error).toEqual('notFound');
    expect.assertions(3);
  });
});
