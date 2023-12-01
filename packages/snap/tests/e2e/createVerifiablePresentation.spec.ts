import { AvailableMethods, ProofOptions } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider, type Json } from '@metamask/snaps-sdk';
import { VerifiablePresentation } from '@veramo/core';
import { beforeAll, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import {
  EXAMPLE_VC,
  EXAMPLE_VC_EIP712,
  EXAMPLE_VC_LDS,
  EXAMPLE_VC2,
} from '../data/verifiable-credentials';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

const methods: AvailableMethods[] = ['did:key', 'did:jwk'];
// TODO: Resolve bugs for lds and EthereumEip712Signature2021
const proofFormats = ['jwt' /* 'lds', */ /* 'EthereumEip712Signature2021' */];
const proofTypes: Record<string, string> = {
  jwt: 'JwtProof2020',
  lds: 'Ed25519Signature2018',
  EthereumEip712Signature2021: 'EthereumEip712Signature2021',
};
const options: ProofOptions[] = [
  { domain: undefined, challenge: undefined },
  { domain: 'localhost', challenge: undefined },
  { domain: undefined, challenge: 'test-challenge' },
  { domain: 'localhost-domain', challenge: 'challenge & domain' },
];

const vcs = [
  { title: 'JWT', vcs: [EXAMPLE_VC] },
  { title: 'JSON-LD', vcs: [EXAMPLE_VC_LDS] },
  { title: 'EIP712', vcs: [EXAMPLE_VC_EIP712] },
  { title: '2 JWTs', vcs: [EXAMPLE_VC, EXAMPLE_VC2] },
  { title: 'JWT & EIP712', vcs: [EXAMPLE_VC, EXAMPLE_VC_EIP712] },
  { title: 'JWT & JSON-LD', vcs: [EXAMPLE_VC, EXAMPLE_VC_LDS] },
  { title: 'JSON-LD & EIP712', vcs: [EXAMPLE_VC_LDS, EXAMPLE_VC_EIP712] },
];

describe('createVerifiablePresentation', () => {
  describe.each(methods)('Using method %s', (method) => {
    let snapMock: SnapsProvider & SnapMock;
    let issuer: string;
    let agent: Agent;

    beforeAll(async () => {
      snapMock = createMockSnap();
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(account),
      });
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      global.snap = snapMock;
      global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

      await StorageService.init();

      await VeramoService.init();
      agent = VeramoService.getAgent();

      const switchMethod = (await onRpcRequest({
        origin: 'localhost',
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

      await agent.clear({ options: { store: ['snap', 'ceramic'] } });
    });

    describe.each(proofFormats)('Using Proof Format: %s', (proofFormat) => {
      describe.each(vcs)('VC formats in VP: $title', (vc) => {
        if (proofFormat === 'jwt') {
          it.each(options)(
            'Should create a Verifiable Presentation with domain: `$domain` and challenge: `$challenge`',
            async (option) => {
              const vp = (await onRpcRequest({
                origin: 'localhost',
                request: {
                  id: 'test-id',
                  jsonrpc: '2.0',
                  method: 'createPresentation',
                  params: {
                    vcs: vc.vcs,
                    proofFormat,
                    proofOptions: option as Json,
                  },
                },
              })) as Result<VerifiablePresentation>;

              if (isError(vp)) {
                throw new Error(vp.error);
              }

              const createdVP = vp.data;

              expect(createdVP).not.toBeNull();

              const validity = await agent.verifyPresentation({
                presentation: createdVP,
                challenge: option?.challenge,
                domain: option?.domain,
              });

              expect(validity.verified).toBe(true);
              expect(createdVP).not.toBeNull();

              expect(createdVP.holder).toBe(issuer);
              expect(createdVP.proof.type).toBe(proofTypes[proofFormat]);
              expect.assertions(5);
            }
          );
        } else {
          it('Should create a Verifiable Presentation without domain or challenge', async () => {
            const vp = (await onRpcRequest({
              origin: 'localhost',
              request: {
                id: 'test-id',
                jsonrpc: '2.0',
                method: 'createPresentation',
                params: {
                  vcs: vc.vcs,
                  proofFormat,
                },
              },
            })) as Result<VerifiablePresentation>;

            if (isError(vp)) {
              throw new Error(vp.error);
            }

            const createdVP = vp.data;

            expect(createdVP).not.toBeNull();

            const validity = await agent.verifyPresentation({
              presentation: createdVP,
            });

            expect(validity.verified).toBe(true);
            expect(createdVP).not.toBeNull();

            expect(createdVP.holder).toBe(issuer);
            expect(createdVP.proof.type).toBe(proofTypes[proofFormat]);
            expect.assertions(5);
          });
        }
      });
    });

    it('Should create a VP without proofFormat option set', async () => {
      const vp = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createPresentation',
          params: {
            vcs: [EXAMPLE_VC],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (isError(vp)) {
        throw new Error(vp.error);
      }

      const createdVP = vp.data;

      expect(createdVP).not.toBeNull();

      const validity = await agent.verifyPresentation({
        presentation: createdVP,
      });

      expect(validity.verified).toBe(true);
      expect(createdVP).not.toBeNull();

      expect(createdVP.holder).toBe(issuer);
      expect(createdVP.proof.type).toBe('JwtProof2020');
      expect.assertions(5);
    });

    it('Should fail creating a VP without any VC', async () => {
      const vp = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createPresentation',
          params: {
            vcs: [],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (!isError(vp)) {
        throw new Error('Should have failed');
      }

      expect(vp.error).toBe('Error: invalid_argument: vcs');
      expect.assertions(1);
    });

    it('Should fail creating a VP with invalid VC', async () => {
      const vp = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createPresentation',
          params: {
            vcs: [{ great: 'day' }],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (!isError(vp)) {
        throw new Error('Should have failed');
      }

      expect(vp.error).toBe(
        `Error: invalid_argument: $input.vcs[0].issuer, $input.vcs[0].credentialSubject, $input.vcs[0]["@context"], $input.vcs[0].issuanceDate, $input.vcs[0].proof`
      );
      expect.assertions(1);
    });
  });
});
