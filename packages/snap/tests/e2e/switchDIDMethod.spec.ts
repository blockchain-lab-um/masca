import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { onRpcRequest } from '../../src';
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
    did: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnA1s63s5ENMUxERdtWmShjBmsDon3RB8K2oziDHXQeagfUbskVFKbZbyuDt4uRD4BiykyXoHaKTAWVUeC5TkSTAb3GpWFNWRbqMuge6uvG17vV1MFzbfv3SWhNAm2SCQSp',
  },
  {
    method: 'did:ethr',
    did: 'did:ethr:0x1:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  },
  {
    method: 'did:pkh',
    did: 'did:pkh:eip155:0x1:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  },
];

describe('switchDIDMethod', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

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

      expect(switchMethod.data).toEqual(methodObj.did);
    }
  );
});
