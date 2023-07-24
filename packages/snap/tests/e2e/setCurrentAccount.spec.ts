import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { VerifiableCredential } from '@veramo/core';

import { onRpcRequest } from '../../src';
import { account } from '../data/constants';
import exampleTestVCPayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('setCurrentAccount', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
  });

  it('should succeed setting the current account', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setCurrentAccount',
        params: {
          currentAccount: '0x41B821bB31902f05eD241b40A8fa3fE56aA76e68',
        },
      },
    })) as Result<void>;

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.data).toBe(true);
    expect.assertions(1);
  });

  it('should fail setting the current account - missing current account parameter', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setCurrentAccount',
        params: {},
      },
    })) as Result<void>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe('Error: invalid_argument: $input.currentAccount');
    expect.assertions(1);
  });

  it('should fail onRpcRequest - current account not set', async () => {
    const defaultState = getDefaultSnapState(account);
    defaultState.currentAccount = '';
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: defaultState,
    });

    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'createVC',
        params: {
          minimalUnsignedCredential: exampleTestVCPayload,
          proofFormat: 'jwt',
          options: {
            save: true,
          },
        },
      },
    })) as Result<VerifiableCredential>;

    if (isSuccess(res)) {
      throw new Error('Should return error');
    }

    expect(res.error).toBe(
      'Error: No current account set. Please call the `setCurrentAccount` RPC method first.'
    );
    expect.assertions(1);
  });
});
