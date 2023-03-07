import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';

export const VC_DATA = [
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: [
        'VerifiableCredential',
        'ProgramCompletionCertificate',
        'ProgramCompletionCertificate',
        'Custom Type',
      ],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      expirationDate: '2025-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-ad4d-c6632c01db14',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        accomplishmentType2: 'Developer Certificate',
        learnerName2: 'a',
        achievement2: 'Certified Solidity Developer 2',
        courseProvider2: 'UM FERI',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'No issuance date'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-4315-a47c-81f63557136e',
      store: 'snap',
    },
  },
  {
    data: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      type: ['VerifiableCredential', 'CourseCredentialJSONLD'],
      issuer: {
        id: 'did:key:z6MkndAHigYrXNpape7jgaC7jHiWwxzB3chuKUGXJg2b5RSj',
        name: 'tenant',
      },
      issuanceDate: '2021-07-26T01:05:05.152Z',
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'Bob',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'https://blockchain-lab.um.si/',
        id: 'did:ethr:goerli:0xb6665128ee91d84590f70c3268765384a9cafbcd',
      },
      proof: {
        type: 'Ed25519Signature2018',
        created: '2021-07-26T01:05:06Z',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..o6hnrrWpArG8LQz2Ex_u66_BtuPdp3Hkz18nhNdNhJ7J1k_2lmCCwsNdmo-kNFirZdSIMzqO-V3wEjMDphVEAA',
        proofPurpose: 'assertionMethod',
        verificationMethod:
          'did:key:z6MkndAHigYrXNpape7jgaC7jHiWwxzB3chuKUGXJg2b5RSj#z6MkndAHigYrXNpape7jgaC7jHiWwxzB3chuKUGXJg2b5RSj',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a1347c-81f63557131e',
      store: 'snap',
    },
  },
  {
    data: {
      issuer: 'did:key:zQ3shYMgaxxFxwm3ipuCPD3n6WT58Up6qUaJUAnYZUeb7EBXW',
      type: ['VerifiableCredential', 'CustomEIP722'],
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'Bob',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'https://blockchain-lab.um.si/',
        id: 'did:ethr:goerli:0xb6665128ee91d84590f70c3268765384a9cafbcd',
      },
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2022-08-12T08:56:59.619Z',
      proof: {
        verificationMethod:
          'did:key:zQ3shYMgaxxFxwm3ipuCPD3n6WT58Up6qUaJUAnYZUeb7EBXW#zQ3shYMgaxxFxwm3ipuCPD3n6WT58Up6qUaJUAnYZUeb7EBXW',
        created: '2022-08-12T08:56:59.619Z',
        proofPurpose: 'assertionMethod',
        type: 'EthereumEip712Signature2021',
        proofValue:
          '0xdf3910af95b8207e6fd1cbbc9beb21941fcbff0eb4032aee356ee52eb340ca2d26bfd8156c811460b4651d140f5b7130532c5e8228e488696435564236f4a0f71c',
        eip712: {
          domain: {
            chainId: 4,
            name: 'VerifiableCredential',
            version: '1',
          },
          messageSchema: {
            EIP712Domain: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'version',
                type: 'string',
              },
              {
                name: 'chainId',
                type: 'uint256',
              },
            ],
            Proof: [
              {
                name: 'created',
                type: 'string',
              },
              {
                name: 'proofPurpose',
                type: 'string',
              },
              {
                name: 'type',
                type: 'string',
              },
              {
                name: 'verificationMethod',
                type: 'string',
              },
            ],
            VerifiablePresentation: [
              {
                name: '@context',
                type: 'string[]',
              },
              {
                name: 'holder',
                type: 'string',
              },
              {
                name: 'issuanceDate',
                type: 'string',
              },
              {
                name: 'proof',
                type: 'Proof',
              },
              {
                name: 'type',
                type: 'string[]',
              },
              {
                name: 'verifiableCredential',
                type: 'string[]',
              },
            ],
          },
          primaryType: 'VerifiableCredential',
        },
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc223-ad4d-c6632c01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b046915-1f2e-46a4-8713-52af73af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: [],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-414b-bb3167-1d01c9103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Short DID'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:1',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522-483a-8a66-5d77d173093a42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB4436A24687621cDD1C77Bb6aCbBEE910d0C517eB4436A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'LongDID'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd4249f9b-1bbd-47e7-bd82-71brr8a0575752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a47c-81f635dsa57136e',
      store: 'test',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'No subject id'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-ad4d-c6632c0s1db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b0469-1f2e-46a4-8713-52af73ggaf3797',
      store: ['snap', 'ceramic'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'No issuer'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {},
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-41dv4b-bb37-1d01c9103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Noissuer field'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522-483a-8a66-5ndd173093a42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd4249f9b-1bbd-47e7-bd82-71b8hha0575752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a47c-81f635571jjjhj36e',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-ad4d-c66sgva32c01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b0469-1f2e-46a4-8713-52af7nhgd3af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-414b-bb37-1d01c9mjfgdm103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x05:0x4331abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a33',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522-483a-8a6eqwf6-5dd173093a42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd4249f9b-1bbd-47e7-bd82-71b8a057gds5752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a47c-81f6iou3557136e',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-ad4d-c6632cssaaasdds01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'aae12b0469-1f2e-46a4-8713-52af73af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c5bb69a405-9885-414b-bb37-1d01c9103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x05:0x4331abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a33',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '3dd8cb4306-d522-483a-8a66-5dd173093a42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd424ee9f9b-1bbd-47e7-bd82-71b8a0575752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43d1se5-a47c-81f63557136e',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-671ce-4dc3123d-ad4d-c6632c01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b0469-1f2e-46a4-871321dsadc13-52af73af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-414b-123fnhhbb37-1d01c9103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x05:0x4331abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a33',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522sad125-483a-8a66-5dd173093a42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd4249f9b-1dsadvvvbbd-47e7-bd82-71b8a0575752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a47c-81f63557d1d211136e',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-add1dfavb04d-c6632c01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b0469-1f2e-46a4-8713-52dsahjkjkaf73af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-414b-bb37-1d01c9103lhkjlec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x05:0x4331abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a33',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522-483a-8a66-5dd173093lhmmma42',
      store: 'ceramic',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        grade: 'B',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-08-13T12:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: 'd4249f9b-1bbd-47e7-bd82-71b8a057ilulk5752',
      store: 'snap',
    },
  },
  {
    data: {
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'a',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'UM FERI',
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
      },
      issuer: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      },
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-07-13T11:08:10.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
      },
    },
    metadata: {
      id: '3c49795f-b900-43e5-a47c-81f6355lkjmmmmm7136e',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c546a01b-67ce-4dc3-ad4d-c6mbnmhg632c01db54',
      store: 'ceramic',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'Diploma'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:web:feri.um.si/RIT',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:web:feri.um.si/student/0123456789',
        achievement: 'Finished RIT Diploma',
        learnerName: 'Anton',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Diploma',
      },
    },
    metadata: {
      id: 'e12b0469-1f2e-46a4-8713-52affhtr73af3797',
      store: 'snap',
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x1:0x1111abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2222',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:key:aZq3dsaDzzs09fZ0123',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
    },
    metadata: {
      id: 'c569a405-9885-414b-bb37-1d01tuytc9103ec1',
      store: ['ceramic', 'snap'],
    },
  },
  {
    data: {
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      proof: {
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibmFtZSI6ImEiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiVU0gRkVSSSJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHg2QTI0Njg3NjIxY0REMUM3N0JiNmFDYkJFRTkxMGQwQzUxN2VCNDQzIiwibmJmIjoxNjUyNDQzNjkwLCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.Z4q7kn4vKdFI5QfAyQmqtWa0icAv91HqxSEwn-AMr4_bY3vfD_WeD3W9hgqf9tsUJPx2ru5gY3tLpAx04nk0RQ',
        type: 'JwtProof2020',
      },
      issuer: {
        id: 'did:ethr:0x05:0x4331abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a33',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-06-13T12:08:10.000Z',
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      credentialSubject: {
        id: 'did:ethr:goerli:0x6A24687621cDD1C77Bb6aCbBEE910d0C517eB443',
        achievement: 'Certified Solidity Developer 2',
        learnerName: 'a',
        courseProvider: 'UM FERI',
        accomplishmentType: 'Developer Certificate',
      },
      expirationDate: '2023-01-11T12:08:10.000Z',
    },
    metadata: {
      id: '38cb4306-d522-483a-8a66-5dd173uio093a42',
      store: 'ceramic',
    },
  },
] as QueryVCsRequestResult[];
