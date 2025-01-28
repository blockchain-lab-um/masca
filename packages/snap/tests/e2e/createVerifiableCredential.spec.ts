import {
  CURRENT_STATE_VERSION,
  type AvailableCredentialStores,
  type AvailableMethods,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { type Result, isError } from '@blockchain-lab-um/utils';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import type { VerifiableCredential } from '@veramo/core';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { type SnapMock, createMockSnap } from '../helpers/snapMock';

const methods: AvailableMethods[] = ['did:key', 'did:jwk'];
// TODO: Resolve bugs for lds and EthereumEip712Signature2021
const proofFormats = ['jwt' /* 'lds', */ /* 'EthereumEip712Signature2021' */];
const proofTypes: Record<string, string> = {
  jwt: 'JwtProof2020',
  lds: 'Ed25519Signature2018',
  EthereumEip712Signature2021: 'EthereumEip712Signature2021',
};

// TODO: Enable ceramic
const stores: AvailableCredentialStores[][] = [
  ['snap'],
  // ['ceramic'],
  // ['snap', 'ceramic'],
];

describe('createVerifiableCredential', () => {
  describe.each(methods)('Using method %s', (method) => {
    let snapMock: SnapsProvider & SnapMock;
    let issuer: string;
    let agent: Agent;

    beforeAll(async () => {
      snapMock = createMockSnap();
      const defaultState = getDefaultSnapState(account);
      defaultState[CURRENT_STATE_VERSION].accountState[
        account
      ].general.account.ssi.storesEnabled.ceramic = false;
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: defaultState,
      });
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

      global.snap = snapMock;
      global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

      await StorageService.init();
      await VeramoService.init();
      agent = VeramoService.getAgent();

      const switchMethod = (await onRpcRequest({
        origin: 'http://localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'switchDIDMethod',
          params: {
            didMethod: method,
          },
        },
      })) as Result<string>;

      if (isError(switchMethod)) {
        throw new Error(switchMethod.error);
      }

      issuer = switchMethod.data;

      await agent.clear({ options: { store: ['snap'] } });
    });

    describe.each(proofFormats)('Using Proof Format: %s', (proofFormat) => {
      it('Should create a VerifiableCredential', async () => {
        const vc = (await onRpcRequest({
          origin: 'http://localhost',
          request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createCredential',
            params: {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat,
            },
          },
        })) as Result<VerifiableCredential>;

        if (isError(vc)) {
          throw new Error(vc.error);
        }

        const validity = await agent.verifyCredential({
          credential: vc.data,
        });
        expect(validity.verified).toBe(true);

        if (typeof vc.data.issuer === 'string') {
          expect(vc.data.issuer).toBe(issuer);
        } else {
          expect(vc.data.issuer.id).toBe(issuer);
        }
        expect(vc.data.proof.type).toBe(proofTypes[proofFormat]);
        expect.assertions(3);
      });

      it.each(stores)(
        'Should create and save a VerifiableCredential in %s',
        async (store) => {
          const vc = (await onRpcRequest({
            origin: 'http://localhost',
            request: {
              id: 'test-id',
              jsonrpc: '2.0',
              method: 'createCredential',
              params: {
                minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
                proofFormat,
                options: {
                  save: true,
                  store,
                },
              },
            },
          })) as Result<VerifiableCredential>;

          if (isError(vc)) {
            throw new Error(vc.error);
          }

          const res = (await onRpcRequest({
            origin: 'http://localhost',
            request: {
              id: 'test-id',
              jsonrpc: '2.0',
              method: 'queryCredentials',
              params: {},
            },
          })) as Result<QueryCredentialsRequestResult[]>;

          if (isError(res)) {
            throw new Error(res.error);
          }

          expect(res.data[0].data).toEqual(vc.data);
          expect(res.data[0].metadata.store).toEqual([store]);

          expect.assertions(2);

          await agent.clear({ options: { store: ['snap'] } });
        }
      );
    });

    it('Should create a VC without proofFormat option set', async () => {
      const vc = (await onRpcRequest({
        origin: 'http://localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createCredential',
          params: {
            minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
          },
        },
      })) as Result<VerifiableCredential>;

      if (isError(vc)) {
        throw new Error(vc.error);
      }

      const validity = await agent.verifyCredential({ credential: vc.data });
      expect(validity.verified).toBe(true);
      if (typeof vc.data.issuer === 'string') {
        expect(vc.data.issuer).toBe(issuer);
      } else {
        expect(vc.data.issuer.id).toBe(issuer);
      }
      expect(vc.data.proof.type).toBe(proofTypes.jwt);
      expect.assertions(3);
    });

    it.skip('Should fail creating a VC without minimalUnsignedCredential', async () => {
      const vc = (await onRpcRequest({
        origin: 'http://localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createCredential',
          params: {},
        },
      })) as Result<VerifiableCredential>;

      if (!isError(vc)) {
        throw new Error('Should have failed');
      }
      expect(vc.error).toBe(
        'Error: invalid_argument: $input.minimalUnsignedCredential'
      );
      expect.assertions(1);
    });

    it('Should fail creating a VC with invalid minimalUnsignedCredential', async () => {
      const vc = (await onRpcRequest({
        origin: 'http://localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createCredential',
          params: {
            minimalUnsignedCredential: {},
          },
        },
      })) as Result<VerifiableCredential>;

      if (!isError(vc)) {
        throw new Error('Should have failed');
      }
      expect(vc.error).toBe(
        'Error: invalid_argument: $input.minimalUnsignedCredential.credentialSubject, $input.minimalUnsignedCredential["@context"]'
      );
      expect.assertions(1);
    });
  });
});
