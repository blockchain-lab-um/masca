import { http, HttpResponse } from 'msw';

export const mswHandlers = [
  http.post('https://polygon-mumbai.blockpi.network/v1/rpc/public', () =>
    HttpResponse.json({ id: 42, jsonrpc: '2.0', result: '0x13881' })
  ),
  http.post('https://eth.llamarpc.com/', () =>
    HttpResponse.json({ id: 42, jsonrpc: '2.0', result: '0x1' })
  ),
  http.post('https://goerli.blockpi.network/v1/rpc/public', () =>
    HttpResponse.json({ id: 42, jsonrpc: '2.0', result: '0x5' })
  ),
  http.post('https://polygon.llamarpc.com/', () =>
    HttpResponse.json({ id: 42, jsonrpc: '2.0', result: '0x89' })
  ),
  http.get('https://schema.iden3.io/core/jsonld/iden3proofs.jsonld', () =>
    HttpResponse.json({
      '@context': {
        '@version': 1.1,
        '@protected': true,
        id: '@id',
        type: '@type',
        Iden3SparseMerkleTreeProof: {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3SparseMerkleTreeProof',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            '@propagate': true,
            id: '@id',
            type: '@type',
            sec: 'https://w3id.org/security#',
            '@vocab':
              'https://schema.iden3.io/core/vocab/Iden3SparseMerkleTreeProof.md#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            mtp: {
              '@id':
                'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof',
              '@type': 'SparseMerkleTreeProof',
            },
            coreClaim: {
              '@id': 'coreClaim',
              '@type': 'xsd:string',
            },
            issuerData: {
              '@id': 'issuerData',
              '@context': {
                '@version': 1.1,
                state: {
                  '@id': 'state',
                  '@context': {
                    txId: {
                      '@id': 'txId',
                      '@type': 'xsd:string',
                    },
                    blockTimestamp: {
                      '@id': 'blockTimestamp',
                      '@type': 'xsd:integer',
                    },
                    blockNumber: {
                      '@id': 'blockNumber',
                      '@type': 'xsd:integer',
                    },
                    rootOfRoots: {
                      '@id': 'rootOfRoots',
                      '@type': 'xsd:string',
                    },
                    claimsTreeRoot: {
                      '@id': 'claimsTreeRoot',
                      '@type': 'xsd:string',
                    },
                    revocationTreeRoot: {
                      '@id': 'revocationTreeRoot',
                      '@type': 'xsd:string',
                    },
                    authCoreClaim: {
                      '@id': 'authCoreClaim',
                      '@type': 'xsd:string',
                    },
                    value: {
                      '@id': 'value',
                      '@type': 'xsd:string',
                    },
                  },
                },
              },
            },
          },
        },
        SparseMerkleTreeProof: {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            type: '@type',
            sec: 'https://w3id.org/security#',
            'smt-proof-vocab':
              'https://schema.iden3.io/core/vocab/SparseMerkleTreeProof.md#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            existence: {
              '@id': 'smt-proof-vocab:existence',
              '@type': 'xsd:boolean',
            },
            revocationNonce: {
              '@id': 'smt-proof-vocab:revocationNonce',
              '@type': 'xsd:number',
            },
            siblings: {
              '@id': 'smt-proof-vocab:siblings',
              '@container': '@list',
            },
            nodeAux: '@nest',
            hIndex: {
              '@id': 'smt-proof-vocab:hIndex',
              '@nest': 'nodeAux',
              '@type': 'xsd:string',
            },
            hValue: {
              '@id': 'smt-proof-vocab:hValue',
              '@nest': 'nodeAux',
              '@type': 'xsd:string',
            },
          },
        },
        BJJSignature2021: {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#BJJSignature2021',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            '@vocab': 'https://schema.iden3.io/core/vocab/BJJSignature2021.md#',
            '@propagate': true,
            type: '@type',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            coreClaim: {
              '@id': 'coreClaim',
              '@type': 'xsd:string',
            },
            issuerData: {
              '@id': 'issuerData',
              '@context': {
                '@version': 1.1,
                authCoreClaim: {
                  '@id': 'authCoreClaim',
                  '@type': 'xsd:string',
                },
                mtp: {
                  '@id':
                    'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof',
                  '@type': 'SparseMerkleTreeProof',
                },
                revocationStatus: {
                  '@id': 'revocationStatus',
                  '@type': '@id',
                },
                state: {
                  '@id': 'state',
                  '@context': {
                    '@version': 1.1,
                    rootOfRoots: {
                      '@id': 'rootOfRoots',
                      '@type': 'xsd:string',
                    },
                    claimsTreeRoot: {
                      '@id': 'claimsTreeRoot',
                      '@type': 'xsd:string',
                    },
                    revocationTreeRoot: {
                      '@id': 'revocationTreeRoot',
                      '@type': 'xsd:string',
                    },
                    value: {
                      '@id': 'value',
                      '@type': 'xsd:string',
                    },
                  },
                },
              },
            },
            signature: {
              '@id': 'signature',
              '@type': 'https://w3id.org/security#multibase',
            },
            domain: 'https://w3id.org/security#domain',
            creator: {
              '@id': 'creator',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
            },
            challenge: 'https://w3id.org/security#challenge',
            created: {
              '@id': 'created',
              '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
            },
            expires: {
              '@id': 'https://w3id.org/security#expiration',
              '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
            },
            nonce: 'https://w3id.org/security#nonce',
            proofPurpose: {
              '@id': 'https://w3id.org/security#proofPurpose',
              '@type': '@vocab',
              '@context': {
                '@protected': true,
                id: '@id',
                type: '@type',
                assertionMethod: {
                  '@id': 'https://w3id.org/security#assertionMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                authentication: {
                  '@id': 'https://w3id.org/security#authenticationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                capabilityInvocation: {
                  '@id': 'https://w3id.org/security#capabilityInvocationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                capabilityDelegation: {
                  '@id': 'https://w3id.org/security#capabilityDelegationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                keyAgreement: {
                  '@id': 'https://w3id.org/security#keyAgreementMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
              },
            },
            proofValue: {
              '@id': 'https://w3id.org/security#proofValue',
              '@type': 'https://w3id.org/security#multibase',
            },
            verificationMethod: {
              '@id': 'https://w3id.org/security#verificationMethod',
              '@type': '@id',
            },
          },
        },
        Iden3ReverseSparseMerkleTreeProof: {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3ReverseSparseMerkleTreeProof',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            type: '@type',
            'iden3-reverse-sparse-merkle-tree-proof-vocab':
              'https://schema.iden3.io/core/vocab/Iden3ReverseSparseMerkleTreeProof.md#',
            revocationNonce:
              'iden3-reverse-sparse-merkle-tree-proof-vocab:revocationNonce',
            statusIssuer: {
              '@context': {
                '@version': 1.1,
                '@protected': true,
                id: '@id',
                type: '@type',
              },
              '@id':
                'iden3-reverse-sparse-merkle-tree-proof-vocab:statusIssuer',
            },
          },
        },
        'Iden3commRevocationStatusV1.0': {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3commRevocationStatusV1.0',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            type: '@type',
            'iden3-comm-revocation-statusV1.0-vocab':
              'https://schema.iden3.io/core/vocab/Iden3commRevocationStatusV1.0.md#',
            revocationNonce:
              'iden3-comm-revocation-statusV1.0-vocab:revocationNonce',
            statusIssuer: {
              '@context': {
                '@version': 1.1,
                '@protected': true,
                id: '@id',
                type: '@type',
              },
              '@id': 'iden3-comm-revocation-statusV1.0-vocab:statusIssuer',
            },
          },
        },
        Iden3OnchainSparseMerkleTreeProof2023: {
          '@id':
            'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3OnchainSparseMerkleTreeProof2023',
          '@context': {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            type: '@type',
            'iden3-onchain-sparse-merkle-tree-proof-2023-vocab':
              'https://schema.iden3.io/core/vocab/Iden3OnchainSparseMerkleTreeProof2023.md#',
            revocationNonce:
              'iden3-onchain-sparse-merkle-tree-proof-2023-vocab:revocationNonce',
            statusIssuer: {
              '@context': {
                '@version': 1.1,
                '@protected': true,
                id: '@id',
                type: '@type',
              },
              '@id':
                'iden3-onchain-sparse-merkle-tree-proof-2023-vocab:statusIssuer',
            },
          },
        },
        JsonSchema2023: 'https://www.w3.org/ns/credentials#JsonSchema2023',
        Iden3RefreshService2023:
          'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3RefreshService2023',
      },
    })
  ),
  http.get('https://www.w3.org/2018/credentials/v1', () =>
    HttpResponse.json({
      '@context': {
        '@version': 1.1,
        '@protected': true,

        id: '@id',
        type: '@type',

        VerifiableCredential: {
          '@id': 'https://www.w3.org/2018/credentials#VerifiableCredential',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            id: '@id',
            type: '@type',

            cred: 'https://www.w3.org/2018/credentials#',
            sec: 'https://w3id.org/security#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',

            credentialSchema: {
              '@id': 'cred:credentialSchema',
              '@type': '@id',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                cred: 'https://www.w3.org/2018/credentials#',

                JsonSchemaValidator2018: 'cred:JsonSchemaValidator2018',
              },
            },
            credentialStatus: {
              '@id': 'cred:credentialStatus',
              '@type': '@id',
            },
            credentialSubject: {
              '@id': 'cred:credentialSubject',
              '@type': '@id',
            },
            evidence: { '@id': 'cred:evidence', '@type': '@id' },
            expirationDate: {
              '@id': 'cred:expirationDate',
              '@type': 'xsd:dateTime',
            },
            holder: { '@id': 'cred:holder', '@type': '@id' },
            issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
            issuer: { '@id': 'cred:issuer', '@type': '@id' },
            issuanceDate: {
              '@id': 'cred:issuanceDate',
              '@type': 'xsd:dateTime',
            },
            proof: {
              '@id': 'sec:proof',
              '@type': '@id',
              '@container': '@graph',
            },
            refreshService: {
              '@id': 'cred:refreshService',
              '@type': '@id',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                cred: 'https://www.w3.org/2018/credentials#',

                ManualRefreshService2018: 'cred:ManualRefreshService2018',
              },
            },
            termsOfUse: { '@id': 'cred:termsOfUse', '@type': '@id' },
            validFrom: { '@id': 'cred:validFrom', '@type': 'xsd:dateTime' },
            validUntil: { '@id': 'cred:validUntil', '@type': 'xsd:dateTime' },
          },
        },

        VerifiablePresentation: {
          '@id': 'https://www.w3.org/2018/credentials#VerifiablePresentation',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            id: '@id',
            type: '@type',

            cred: 'https://www.w3.org/2018/credentials#',
            sec: 'https://w3id.org/security#',

            holder: { '@id': 'cred:holder', '@type': '@id' },
            proof: {
              '@id': 'sec:proof',
              '@type': '@id',
              '@container': '@graph',
            },
            verifiableCredential: {
              '@id': 'cred:verifiableCredential',
              '@type': '@id',
              '@container': '@graph',
            },
          },
        },

        EcdsaSecp256k1Signature2019: {
          '@id': 'https://w3id.org/security#EcdsaSecp256k1Signature2019',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            id: '@id',
            type: '@type',

            sec: 'https://w3id.org/security#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',

            challenge: 'sec:challenge',
            created: {
              '@id': 'http://purl.org/dc/terms/created',
              '@type': 'xsd:dateTime',
            },
            domain: 'sec:domain',
            expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
            jws: 'sec:jws',
            nonce: 'sec:nonce',
            proofPurpose: {
              '@id': 'sec:proofPurpose',
              '@type': '@vocab',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                sec: 'https://w3id.org/security#',

                assertionMethod: {
                  '@id': 'sec:assertionMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                authentication: {
                  '@id': 'sec:authenticationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
              },
            },
            proofValue: 'sec:proofValue',
            verificationMethod: {
              '@id': 'sec:verificationMethod',
              '@type': '@id',
            },
          },
        },

        EcdsaSecp256r1Signature2019: {
          '@id': 'https://w3id.org/security#EcdsaSecp256r1Signature2019',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            id: '@id',
            type: '@type',

            sec: 'https://w3id.org/security#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',

            challenge: 'sec:challenge',
            created: {
              '@id': 'http://purl.org/dc/terms/created',
              '@type': 'xsd:dateTime',
            },
            domain: 'sec:domain',
            expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
            jws: 'sec:jws',
            nonce: 'sec:nonce',
            proofPurpose: {
              '@id': 'sec:proofPurpose',
              '@type': '@vocab',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                sec: 'https://w3id.org/security#',

                assertionMethod: {
                  '@id': 'sec:assertionMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                authentication: {
                  '@id': 'sec:authenticationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
              },
            },
            proofValue: 'sec:proofValue',
            verificationMethod: {
              '@id': 'sec:verificationMethod',
              '@type': '@id',
            },
          },
        },

        Ed25519Signature2018: {
          '@id': 'https://w3id.org/security#Ed25519Signature2018',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            id: '@id',
            type: '@type',

            sec: 'https://w3id.org/security#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',

            challenge: 'sec:challenge',
            created: {
              '@id': 'http://purl.org/dc/terms/created',
              '@type': 'xsd:dateTime',
            },
            domain: 'sec:domain',
            expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
            jws: 'sec:jws',
            nonce: 'sec:nonce',
            proofPurpose: {
              '@id': 'sec:proofPurpose',
              '@type': '@vocab',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                sec: 'https://w3id.org/security#',

                assertionMethod: {
                  '@id': 'sec:assertionMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                authentication: {
                  '@id': 'sec:authenticationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
              },
            },
            proofValue: 'sec:proofValue',
            verificationMethod: {
              '@id': 'sec:verificationMethod',
              '@type': '@id',
            },
          },
        },

        RsaSignature2018: {
          '@id': 'https://w3id.org/security#RsaSignature2018',
          '@context': {
            '@version': 1.1,
            '@protected': true,

            challenge: 'sec:challenge',
            created: {
              '@id': 'http://purl.org/dc/terms/created',
              '@type': 'xsd:dateTime',
            },
            domain: 'sec:domain',
            expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
            jws: 'sec:jws',
            nonce: 'sec:nonce',
            proofPurpose: {
              '@id': 'sec:proofPurpose',
              '@type': '@vocab',
              '@context': {
                '@version': 1.1,
                '@protected': true,

                id: '@id',
                type: '@type',

                sec: 'https://w3id.org/security#',

                assertionMethod: {
                  '@id': 'sec:assertionMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
                authentication: {
                  '@id': 'sec:authenticationMethod',
                  '@type': '@id',
                  '@container': '@set',
                },
              },
            },
            proofValue: 'sec:proofValue',
            verificationMethod: {
              '@id': 'sec:verificationMethod',
              '@type': '@id',
            },
          },
        },

        proof: {
          '@id': 'https://w3id.org/security#proof',
          '@type': '@id',
          '@container': '@graph',
        },
      },
    })
  ),
  http.get(
    'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-nonmerklized.jsonld',
    () =>
      HttpResponse.json({
        '@context': [
          {
            '@version': 1.1,
            '@protected': true,
            id: '@id',
            type: '@type',
            KYCAgeCredential: {
              '@id':
                'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-nonmerklized.jsonld#KYCAgeCredential',
              '@context': {
                '@version': 1.1,
                '@protected': true,
                id: '@id',
                type: '@type',
                iden3_serialization:
                  'iden3:v1:slotIndexA=birthday&slotIndexB=documentType',
                'kyc-vocab':
                  'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#',
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                birthday: {
                  '@id': 'kyc-vocab:birthday',
                  '@type': 'xsd:integer',
                },
                documentType: {
                  '@id': 'kyc-vocab:documentType',
                  '@type': 'xsd:integer',
                },
              },
            },
            KYCCountryOfResidenceCredential: {
              '@id':
                'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-nonmerklized.jsonld#KYCCountryOfResidenceCredential',
              '@context': {
                '@version': 1.1,
                '@protected': true,
                id: '@id',
                type: '@type',
                'kyc-vocab':
                  'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#',
                iden3_serialization:
                  'iden3:v1:slotIndexA=birthday&slotIndexB=documentType',
                xsd: 'http://www.w3.org/2001/XMLSchema#',
                countryCode: {
                  '@id': 'kyc-vocab:countryCode',
                  '@type': 'xsd:integer',
                },
                documentType: {
                  '@id': 'kyc-vocab:documentType',
                  '@type': 'xsd:integer',
                },
              },
            },
          },
        ],
      })
  ),
  http.get(
    'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/kyc-nonmerklized.json',
    () =>
      HttpResponse.json({
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        $metadata: {
          uris: {
            jsonLdContext:
              'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-nonmerklized.jsonld',
          },
        },
        required: [
          '@context',
          'id',
          'type',
          'issuanceDate',
          'credentialSubject',
          'credentialSchema',
          'credentialStatus',
          'issuer',
        ],
        properties: {
          '@context': {
            type: ['string', 'array', 'object'],
          },
          id: {
            type: 'string',
          },
          type: {
            type: ['string', 'array'],
            items: {
              type: 'string',
            },
          },
          issuer: {
            type: ['string', 'object'],
            format: 'uri',
            required: ['id'],
            properties: {
              id: {
                type: 'string',
                format: 'uri',
              },
            },
          },
          issuanceDate: {
            type: 'string',
            format: 'date-time',
          },
          expirationDate: {
            type: 'string',
            format: 'date-time',
          },
          credentialSchema: {
            type: 'object',
            required: ['id', 'type'],
            properties: {
              id: {
                type: 'string',
                format: 'uri',
              },
              type: {
                type: 'string',
              },
            },
          },
          credentialSubject: {
            type: 'object',
            required: ['birthday', 'documentType'],
            properties: {
              id: {
                title: 'Credential Subject ID',
                type: 'string',
                format: 'uri',
              },
              birthday: {
                type: 'integer',
              },
              documentType: {
                type: 'integer',
              },
            },
          },
        },
      })
  ),
];
