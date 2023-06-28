import { AvailableMethods, ProofOptions } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { VerifiablePresentation } from '@veramo/core';

import { onRpcRequest } from '../../src';
import { getAgent, type Agent } from '../../src/veramo/setup';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import exampleVCEIP712 from '../data/verifiable-credentials/exampleEIP712.json';
import exampleVCJSONLD from '../data/verifiable-credentials/exampleJSONLD.json';
import exampleVC_2 from '../data/verifiable-credentials/exampleJWT_2.json';
import exampleVC_3 from '../data/verifiable-credentials/exampleJWT_3.json';
import exampleVC from '../data/verifiable-credentials/exampleJWT.json';
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
  { title: 'JWT', vcs: [exampleVC] },
  { title: 'JSON-LD', vcs: [exampleVCJSONLD] },
  { title: 'EIP712', vcs: [exampleVCEIP712] },
  { title: '2 JWTs', vcs: [exampleVC, exampleVC_2] },
  { title: '3 JWTs', vcs: [exampleVC, exampleVC_2, exampleVC_3] },
  { title: 'JWT & EIP712', vcs: [exampleVC, exampleVCEIP712] },
  { title: 'JWT & JSON-LD', vcs: [exampleVC, exampleVCJSONLD] },
  { title: 'JSON-LD & EIP712', vcs: [exampleVCJSONLD, exampleVCEIP712] },
];

describe.each(methods)(
  'Create VerifiablePresentation with method %s',
  (method) => {
    let snapMock: SnapsGlobalObject & SnapMock;
    let issuer: string;
    let agent: Agent;

    beforeAll(async () => {
      snapMock = createMockSnap();
      snapMock.rpcMocks.snap_manageState({
        operation: 'update',
        newState: getDefaultSnapState(account),
      });
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
      const ethereumMock = snapMock as unknown as MetaMaskInpageProvider;
      agent = await getAgent(snapMock, ethereumMock);
      global.snap = snapMock;
      global.ethereum = snapMock as unknown as MetaMaskInpageProvider;
      snapMock.rpcMocks.snap_dialog.mockReturnValue(true);

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
    });

    beforeEach(async () => {
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
                  method: 'createVP',
                  params: {
                    vcs: vc.vcs,
                    proofFormat,
                    proofOptions: option,
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
                method: 'createVP',
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
          method: 'createVP',
          params: {
            vcs: [exampleVC],
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
          method: 'createVP',
          params: {
            vcs: [],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (!isError(vp)) {
        throw new Error('Should have failed');
      }

      expect(vp.error).toBe('Error: Invalid CreateVP request');
      expect.assertions(1);
    });

    it('Should fail creating a VP with invalid VC', async () => {
      const vp = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'createVP',
          params: {
            vcs: [{ great: 'day' }],
          },
        },
      })) as Result<VerifiablePresentation>;

      if (!isError(vp)) {
        throw new Error('Should have failed');
      }

      expect(vp.error).toBe(
        `TypeError: Cannot read properties of undefined (reading 'jwt')`
      );
      expect.assertions(1);
    });
  }
);
