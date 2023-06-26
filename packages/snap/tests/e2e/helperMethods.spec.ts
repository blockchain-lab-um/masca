import { isError, isSuccess, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type {  SnapsGlobalObject } from '@metamask/snaps-types';

import { availableMethods, availableVCStores } from '@blockchain-lab-um/masca-types';
import { VerifiableCredential } from '@veramo/core';
import { onRpcRequest } from '../../src';
import { getAgent, type Agent } from '../../src/veramo/setup';
import { account } from '../data/constants';
import { getDefaultSnapState} from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';
import exampleTestVCPayload from '../data/credentials/examplePayload.json';

describe('Helper Methods', () => {
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

  describe('getSelectedMethod', () => {
    it('should succeed and return did:ethr', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSelectedMethod',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toBe('did:ethr');

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

      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSelectedMethod',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toBe('did:key');

      expect.assertions(1);
    });
  });

  describe('getAvailableMethods', () => {
    it('should succeed and return available methods', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAvailableMethods',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual(availableMethods);

      expect.assertions(1);
    });
  });

  describe('setVCStore', () => {
    it('should throw and error when using wrong vcStore', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramicc', value: true },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error).toBe('Error: Store ceramicc is not supported!');

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramic', value: 'tlo' },
        },
      })) as Result<unknown>;

      if (isSuccess(res)) {
        throw new Error('Should return error');
      }

      expect(res.error).toBe('Error: Invalid setVCStore request.');

      expect.assertions(2);
    });

    it('should succeed toggling ceramic store to true', async () => {
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      let res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'setVCStore',
          params: { store: 'ceramic', value: true },
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toBe(true);

      res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVCStore',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual({ ceramic: true, snap: true });

      expect.assertions(2);
    });
  });

  describe('getVCStore', () => {
    it('should succeed and return snap', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getVCStore',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual({ ceramic: true, snap: true });

      expect.assertions(1);
    });
  });

  describe('getAvailableVCStores', () => {
    it('should succeed and return available VC stores', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAvailableVCStores',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual(availableVCStores);

      expect.assertions(1);
    });
  });

  describe('getAccountSettings', () => {
    const state = getDefaultSnapState(account);
    it('should succeed and return account settings', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getAccountSettings',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      state.accountState[account].accountConfig.ssi.didMethod = 'did:key';

      expect(res.data).toEqual(state.accountState[account].accountConfig);

      expect.assertions(1);
    });
  });

  describe('getSnapSettings', () => {
    const state = getDefaultSnapState(account);
    it('should succeed and return snap settings', async () => {
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'getSnapSettings',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual(state.snapConfig);

      expect.assertions(1);
    });
  });

  describe('setCurrentAccount', () => {
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

      expect(res.data).toBeTrue();
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

      expect(res.error).toBe('Error: Invalid SetCurrentAccount request');
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
        'Error: No account set. Use setCurrentAccount to set an account.'
      );
      expect.assertions(1);
    });
  });

  describe('validateStoredCeramicSession', () => {
    it('should return true for valid session', async () => {
        const defaultState = getDefaultSnapState(account);
        snapMock.rpcMocks.snap_manageState({
            operation: 'update',
            newState: defaultState,
        });
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'validateStoredCeramicSession',
          params: {},
        },
      })) as Result<unknown>;

      if (isError(res)) {
        throw new Error(res.error);
      }

      expect(res.data).toEqual(true);

      expect.assertions(1);
    });

    it('should fail setting and invalid session string', async () => {
        const defaultState = getDefaultSnapState(account);
        defaultState.accountState[account].ceramicSession = "invalid-session";
        snapMock.rpcMocks.snap_manageState({
            operation: 'update',
            newState: defaultState,
        });
      const res = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'validateStoredCeramicSession',
          params: {},
        },
      })) as Result<unknown>;
    
      if (!isError(res)) {
        throw new Error('Should return error');
      }
    
      expect(res.error).toEqual("SyntaxError: Unexpected end of data");
    
      expect.assertions(1);
    });

    it.todo('Set expired session and return false')
  });

  describe('setCeramicSession', () => {
    it('should fail to set invalid session', async () => {
        const defaultState = getDefaultSnapState(account);
        snapMock.rpcMocks.snap_manageState({
            operation: 'update',
            newState: defaultState,
        });
        const res = (await onRpcRequest({
            origin: 'localhost',
            request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'setCeramicSession',
            params: {
                serializedSession: 'abc'
            },
            },
        })) as Result<unknown>;

        if (isError(res)) {
            throw new Error(res.error);
        }

        expect(res.data).toEqual(true);

        expect.assertions(1);
    });
  });

});