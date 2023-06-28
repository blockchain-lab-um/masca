import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
import { getAgent, type Agent } from '../../src/veramo/setup';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

// TODO verify that these are the correct dids (after keypair implementation is complete and final mappings are set)
const methods = [
  {
    method: 'did:key',
    did: 'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
  },
  {
    method: 'did:jwk',
    did: 'did:jwk:eyJhbGciOiJFUzI1NksiLCJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsInVzZSI6InNpZyIsIngiOiJlU01sN3BRMWRfX0JzOEpYM1lKb1V3ZVpyTFZ2Zm1TSEUzdG9IenMwbnpjIiwieSI6IlNoajV1M0ZiQkNEZnpEX1lFSW5tVmRWUmdNVU9PdGV3X0lsZEpwT2duaWMifQ',
  },
  {
    method: 'did:key:ebsi',
    underlyingMethod: 'did:key',
    did: 'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2fa6K44b7RtyESctmKyS3RTWEcXJUa749Zst4jc5mtxcVUSFEE7bYmZ6Srqj9Mv9vjCdi369c9W9XDekwR7C6o1YwejLq61PoNaY55CVMA87xD3JWct6rpZPuzdjoNg7fcx'
  }
];

describe('Get DID', () => {
  let snapMock: SnapsGlobalObject & SnapMock;
  let agent: Agent;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
    agent = await getAgent(snapMock, ethereumMock);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
  });

  beforeEach(async () => {
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

  it.todo('Should return correct did:ethr');

  it.todo('Should return correct did:pkh');

  it.each(methods)(
    'should return correct identifier for $method',
    async (methodObj) => {
      const switchMethod = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: methodObj.method,
          },
        },
      })) as Result<string>;

      if (isError(switchMethod)) {
        throw new Error(switchMethod.error);
      }

      if(methodObj.underlyingMethod) {
        expect(switchMethod.data.substring(0, methodObj.underlyingMethod.length)).toBe(methodObj.underlyingMethod);
      } else {
      expect(switchMethod.data.substring(0, methodObj.method.length)).toBe(
        methodObj.method
      );
      }

      const did = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getDID',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(did)) {
        throw new Error(did.error);
      }

      expect(did.data).toBe(methodObj.did);
      expect.assertions(2);
    }
  );
});
