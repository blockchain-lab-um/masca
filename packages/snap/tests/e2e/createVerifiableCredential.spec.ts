import {
    AvailableMethods,
    AvailableVCStores,
    QueryVCsRequestResult,
  } from '@blockchain-lab-um/masca-types';
  import { isError, Result } from '@blockchain-lab-um/utils';
  import { MetaMaskInpageProvider } from '@metamask/providers';
  import type { SnapsGlobalObject } from '@metamask/snaps-types';
  import type { VerifiableCredential } from '@veramo/core';
  
  import { onRpcRequest } from '../../src';
  import { getAgent, type Agent } from '../../src/veramo/setup';
  import { account } from '../data/constants';
  import examplePayload from '../data/credentials/examplePayload.json';
  import { getDefaultSnapState } from '../data/defaultSnapState';
  import { createMockSnap, SnapMock } from '../helpers/snapMock';
  
  const methods: AvailableMethods[] = ['did:key', 'did:jwk']
  const proofFormats = ['jwt', /* 'lds', */ 'EthereumEip712Signature2021'];
  const proofTypes: Record<string, string> = 
  {
    jwt: 'JwtProof2020',
    lds: 'Ed25519Signature2018',
    EthereumEip712Signature2021: 'EthereumEip712Signature2021',
  };
  const stores: AvailableVCStores[][] = [
    ['snap'],
    // ['ceramic'],
    // ['snap', 'ceramic'],
  ];

  describe.each(methods)('Create VerifiableCredential with %s', (method) => {
    let snapMock: SnapsGlobalObject & SnapMock;
    let issuer: string;
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

    it('Should switch DID method', async () => {
        const switchMethod = (await onRpcRequest({
            origin: 'localhost',
            request: {
              id: 'test-id',
              jsonrpc: '2.0',
              method: 'switchDIDMethod',
              params: {
                didMethod: method
              },
            },
          })) as Result<string>;

        if(isError(switchMethod)) {
            throw new Error(switchMethod.error);
        }

        expect(switchMethod.data.substring(0, method.length)).toBe(method);
        issuer = switchMethod.data;
        expect.assertions(1);
    });

    describe.each(proofFormats)('Using Proof Format: %s', (proofFormat) => {
        it('Should create a VerifiableCredential', async () => {
            const vc = await onRpcRequest({
                origin: 'localhost',
                request: {
                id: 'test-id',
                jsonrpc: '2.0',
                method: 'createVC',
                params: {
                    minimalUnsignedCredential: examplePayload,
                    proofFormat,
                },
                },
            }) as Result<VerifiableCredential>;

            if(isError(vc)) {
                throw new Error(vc.error);
            }
            
            const validity = await agent.verifyCredential({ credential: vc.data });
            expect(validity.verified).toBe(true);
            if(typeof vc.data.issuer === 'string') {
                expect(vc.data.issuer).toBe(issuer);
            }
            else {
                expect(vc.data.issuer.id).toBe(issuer);
            }
            expect(vc.data.proof.type).toBe(proofTypes[proofFormat]);
            expect.assertions(3);
        });

        it.each(stores)('Should create and save a VerifiableCredential in %s ', async (store) => {
            const vc = await onRpcRequest({
                origin: 'localhost',
                request: {
                id: 'test-id',
                jsonrpc: '2.0',
                method: 'createVC',
                params: {
                    minimalUnsignedCredential: examplePayload,
                    proofFormat,
                    options: {
                        save: true,
                        store,
                    }
                },
                },
            }) as Result<VerifiableCredential>;

            expect(isError(vc)).toBe(false);
            if(isError(vc)) {
                throw new Error(vc.error);
            }

            const res = (await onRpcRequest({
                origin: 'localhost',
                request: {
                  id: 'test-id',
                  jsonrpc: '2.0',
                  method: 'queryVCs',
                  params: {},
                },
              })) as Result<QueryVCsRequestResult[]>;
        
            
              expect(isError(res)).toBe(false);
              if (isError(res)) {
                throw new Error(res.error);
              }

              console.log('query.vc')
              console.log(res.data[0].data)

              expect(res.data[0].data).toEqual(vc.data);
              expect(res.data[0].metadata.store).toEqual([store])
        
              expect.assertions(4);
        });
    });

    it('Should create a VC without proofFormat option set', async () => {
        const vc = await onRpcRequest({
            origin: 'localhost',
            request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createVC',
            params: {
                minimalUnsignedCredential: examplePayload,
            },
            },
        }) as Result<VerifiableCredential>;

        if(isError(vc)) {
            throw new Error(vc.error);
        }
        
        const validity = await agent.verifyCredential({ credential: vc.data });
        expect(validity.verified).toBe(true);
        if(typeof vc.data.issuer === 'string') {
            expect(vc.data.issuer).toBe(issuer);
        }
        else {
            expect(vc.data.issuer.id).toBe(issuer);
        }
        expect(vc.data.proof.type).toBe(proofTypes.jwt);
        expect.assertions(3);
    });

    it('Should fail creating a VC without minimalUnsignedCredential', async () => {
        const vc = await onRpcRequest({
            origin: 'localhost',
            request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createVC',
            params: {
            },
            },
        }) as Result<VerifiableCredential>;

        if(!isError(vc)) {
            throw new Error('Should have failed');
        }
        expect(isError(vc)).toBe(true);
        expect(vc.error).toBe('Error: Invalid CreateVC request')
        expect.assertions(2);
    });

    it('Should fail creating a VC with invalid minimalUnsignedCredential', async () => {
        const vc = await onRpcRequest({
            origin: 'localhost',
            request: {
            id: 'test-id',
            jsonrpc: '2.0',
            method: 'createVC',
            params: {
                minimalUnsignedCredential: {
                },
            },
            }}) as Result<VerifiableCredential>;

        if(!isError(vc)) {
            throw new Error('Should have failed');
        }
        expect(isError(vc)).toBe(true);
        expect(vc.error).toBe('TypeError: schema_error: credentialSubject must not be empty')
        expect.assertions(2);
    });
  });
  