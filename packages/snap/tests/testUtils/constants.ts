import { SnapConfirmParams, SSISnapState } from '../../src/interfaces';
import cloneDeep from 'lodash.clonedeep';
import { getEmptyAccountState } from '../../src/utils/config';
import { DIDDocument, DIDResolutionResult, IIdentifier } from '@veramo/core';
import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';

export const mnemonic =
  'prosper pair similar canoe work humble loud wild aunt reunion olive obscure';
export const privateKey =
  '0x63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae';
export const privateKey2 =
  '0xb29764680b2a07fa4a762d255e3f689fb5c05cc885e6dfd3de5d5948b5a6b47f';
export const address = '0xb6665128eE91D84590f70c3268765384A9CAfBCd';
export const address2 = '0x461e557A07AC110BC947F18b3828e26f013dac39';
export const publicKey =
  '0x0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a';
export const compressedPublicKey =
  '0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85';
export const signedMsg =
  '0x30eb4dbf93e7bfdb109ed03f7803f2378fa27d18ddc233cb3d121b5ba13253fe2515076d1ba66f3dc282c182479b843c925c62eb1f5a0676bcaf995e8e7552941c';
export const infuraToken = '0ec03090465d400c988a14831aacfe37';
export const publicKeyHex =
  '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a';
export const exampleDIDKeyIdentifier =
  'zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik';
export const exampleDIDKey = `did:key:${exampleDIDKeyIdentifier}`;
export const exampleDID =
  'did:ethr:0x5:0xb6665128eE91D84590f70c3268765384A9CAfBCd';
export const exampleImportedDID: IIdentifier = {
  did: 'did:ethr:0x5:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  provider: 'did:ethr',
  controllerKeyId: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  keys: [
    {
      kid: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      type: 'Secp256k1',
      kms: 'web3',
      privateKeyHex:
        '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
      publicKeyHex:
        '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a',
    },
  ],
  services: [],
};

export const exampleDIDKeyDocument: DIDDocument = {
  id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/secp256k1-2019/v1',
  ],
  assertionMethod: [
    'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  ],
  authentication: [
    'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  ],
  capabilityInvocation: [
    'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  ],
  capabilityDelegation: [
    'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  ],
  keyAgreement: [
    'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
  ],
  verificationMethod: [
    {
      id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
      type: 'EcdsaSecp256k1RecoveryMethod2020',
      controller:
        'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
      publicKeyHex: publicKeyHex,
    },
  ],
};

export const exampleDIDKeyResolution: DIDResolutionResult = {
  didDocumentMetadata: {},
  didResolutionMetadata: {},
  didDocument: exampleDIDKeyDocument,
};

export const exampleImportedDIDWIthoutPrivateKey: IIdentifier = {
  did: 'did:ethr:0x5:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  provider: 'did:ethr',
  controllerKeyId: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  keys: [
    {
      kid: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      type: 'Secp256k1',
      kms: 'snap',
      publicKeyHex:
        '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a',
      meta: {
        algorithms: [
          'ES256K',
          'ES256K-R',
          'eth_signTransaction',
          'eth_signTypedData',
          'eth_signMessage',
          'eth_rawSign',
        ],
      },
    },
  ],
  services: [],
};

export const exampleVC = {
  credentialSubject: {
    accomplishmentType: 'Developer Certificate',
    learnerName: 'Bob',
    achievement: 'Certified Solidity Developer 2',
    courseProvider: 'https://blockchain-lab.um.si/',
    id: 'did:ethr:goerli:0xb6665128ee91d84590f70c3268765384a9cafbcd',
  },
  issuer: {
    id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
  },
  id: 'b2f479c5-2058-4286-a70d-f636966266de',
  type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
  credentialSchema: {
    id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
    type: 'JsonSchemaValidator2018',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
  ],
  issuanceDate: '2022-09-16T11:37:05.000Z',
  proof: {
    type: 'JwtProof2020',
    jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibGVhcm5lck5hbWUiOiJCb2IiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiaHR0cHM6Ly9ibG9ja2NoYWluLWxhYi51bS5zaS8ifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9qc29uLXNjaGVtYS5qc29uIiwidHlwZSI6Ikpzb25TY2hlbWFWYWxpZGF0b3IyMDE4In19LCJzdWIiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4YjY2NjUxMjhlZTkxZDg0NTkwZjcwYzMyNjg3NjUzODRhOWNhZmJjZCIsImp0aSI6ImIyZjQ3OWM1LTIwNTgtNDI4Ni1hNzBkLWY2MzY5NjYyNjZkZSIsIm5iZiI6MTY2MzMyODIyNSwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDAyNDFhYmQ2NjJkYTA2ZDBhZjJmMDE1MmE4MGJjMDM3ZjY1YTdmOTAxMTYwY2ZlMWViMzVlZjNmMGM1MzJhMmE0ZCJ9.lbUqHPCkgBtX_uulh_3JRYK2GKirUCRgJDUK5IdVI55vG6aOTk6UtEezH3j4H3VB85eCmJm_mFM7Ks6OOZCVfA',
  },
};

export const exampleVCinVP = {
  credentialSubject: {
    accomplishmentType: 'Developer Certificate',
    learnerName: 'Bob',
    achievement: 'Certified Solidity Developer 2',
    courseProvider: 'https://blockchain-lab.um.si/',
    id: 'did:ethr:rinkeby:0xb6665128ee91d84590f70c3268765384a9cafbcd',
  },
  issuer: {
    id: 'did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
  },
  id: 'b2f479c5-2058-4286-a70d-f636966266de',
  type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
  credentialSchema: {
    id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
    type: 'JsonSchemaValidator2018',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
  ],
  issuanceDate: '2022-09-16T11:37:05.000Z',
  proof: {
    type: 'JwtProof2020',
    jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibGVhcm5lck5hbWUiOiJCb2IiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiaHR0cHM6Ly9ibG9ja2NoYWluLWxhYi51bS5zaS8ifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9qc29uLXNjaGVtYS5qc29uIiwidHlwZSI6Ikpzb25TY2hlbWFWYWxpZGF0b3IyMDE4In19LCJzdWIiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4YjY2NjUxMjhlZTkxZDg0NTkwZjcwYzMyNjg3NjUzODRhOWNhZmJjZCIsImp0aSI6ImIyZjQ3OWM1LTIwNTgtNDI4Ni1hNzBkLWY2MzY5NjYyNjZkZSIsIm5iZiI6MTY2MzMyODIyNSwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDAyNDFhYmQ2NjJkYTA2ZDBhZjJmMDE1MmE4MGJjMDM3ZjY1YTdmOTAxMTYwY2ZlMWViMzVlZjNmMGM1MzJhMmE0ZCJ9.lbUqHPCkgBtX_uulh_3JRYK2GKirUCRgJDUK5IdVI55vG6aOTk6UtEezH3j4H3VB85eCmJm_mFM7Ks6OOZCVfA',
  },
};

export const jsonPath =
  '$[?(@.data.credentialSubject.achievement == "Certified Solidity Developer 2")]';

export const exampleVCJWT = {
  verifiableCredential: [
    {
      credentialSubject: {
        accomplishmentType: 'Developer Certificate',
        learnerName: 'Bob',
        achievement: 'Certified Solidity Developer 2',
        courseProvider: 'https://blockchain-lab.um.si/',
        id: 'did:ethr:goerli:0xb6665128ee91d84590f70c3268765384a9cafbcd',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d',
      },
      id: 'b2f479c5-2058-4286-a70d-f636966266de',
      type: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      credentialSchema: {
        id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        type: 'JsonSchemaValidator2018',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
      ],
      issuanceDate: '2022-09-16T11:37:05.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibGVhcm5lck5hbWUiOiJCb2IiLCJhY2hpZXZlbWVudCI6IkNlcnRpZmllZCBTb2xpZGl0eSBEZXZlbG9wZXIgMiIsImNvdXJzZVByb3ZpZGVyIjoiaHR0cHM6Ly9ibG9ja2NoYWluLWxhYi51bS5zaS8ifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9qc29uLXNjaGVtYS5qc29uIiwidHlwZSI6Ikpzb25TY2hlbWFWYWxpZGF0b3IyMDE4In19LCJzdWIiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4YjY2NjUxMjhlZTkxZDg0NTkwZjcwYzMyNjg3NjUzODRhOWNhZmJjZCIsImp0aSI6ImIyZjQ3OWM1LTIwNTgtNDI4Ni1hNzBkLWY2MzY5NjYyNjZkZSIsIm5iZiI6MTY2MzMyODIyNSwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDAyNDFhYmQ2NjJkYTA2ZDBhZjJmMDE1MmE4MGJjMDM3ZjY1YTdmOTAxMTYwY2ZlMWViMzVlZjNmMGM1MzJhMmE0ZCJ9.lbUqHPCkgBtX_uulh_3JRYK2GKirUCRgJDUK5IdVI55vG6aOTk6UtEezH3j4H3VB85eCmJm_mFM7Ks6OOZCVfA',
      },
    },
  ],
  holder: 'did:ethr:0x5:0xb6665128ee91d84590f70c3268765384a9cafbcd',
  type: ['VerifiablePresentation', 'Custom'],
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  issuanceDate: '2022-11-08T12:43:09.000Z',
  proof: {
    type: 'JwtProof2020',
    jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iLCJDdXN0b20iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5rc2lMQ0owZVhBaU9pSktWMVFpZlEuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSXNJbWgwZEhCek9pOHZZbVYwWVM1aGNHa3VjMk5vWlcxaGN5NXpaWEowYnk1cFpDOTJNUzl3ZFdKc2FXTXZjSEp2WjNKaGJTMWpiMjF3YkdWMGFXOXVMV05sY25ScFptbGpZWFJsTHpFdU1DOXNaQzFqYjI1MFpYaDBMbXB6YjI0aVhTd2lkSGx3WlNJNld5SldaWEpwWm1saFlteGxRM0psWkdWdWRHbGhiQ0lzSWxCeWIyZHlZVzFEYjIxd2JHVjBhVzl1UTJWeWRHbG1hV05oZEdVaVhTd2lZM0psWkdWdWRHbGhiRk4xWW1wbFkzUWlPbnNpWVdOamIyMXdiR2x6YUcxbGJuUlVlWEJsSWpvaVJHVjJaV3h2Y0dWeUlFTmxjblJwWm1sallYUmxJaXdpYkdWaGNtNWxjazVoYldVaU9pSkNiMklpTENKaFkyaHBaWFpsYldWdWRDSTZJa05sY25ScFptbGxaQ0JUYjJ4cFpHbDBlU0JFWlhabGJHOXdaWElnTWlJc0ltTnZkWEp6WlZCeWIzWnBaR1Z5SWpvaWFIUjBjSE02THk5aWJHOWphMk5vWVdsdUxXeGhZaTUxYlM1emFTOGlmU3dpWTNKbFpHVnVkR2xoYkZOamFHVnRZU0k2ZXlKcFpDSTZJbWgwZEhCek9pOHZZbVYwWVM1aGNHa3VjMk5vWlcxaGN5NXpaWEowYnk1cFpDOTJNUzl3ZFdKc2FXTXZjSEp2WjNKaGJTMWpiMjF3YkdWMGFXOXVMV05sY25ScFptbGpZWFJsTHpFdU1DOXFjMjl1TFhOamFHVnRZUzVxYzI5dUlpd2lkSGx3WlNJNklrcHpiMjVUWTJobGJXRldZV3hwWkdGMGIzSXlNREU0SW4xOUxDSnpkV0lpT2lKa2FXUTZaWFJvY2pweWFXNXJaV0o1T2pCNFlqWTJOalV4TWpobFpUa3haRGcwTlRrd1pqY3dZek15TmpnM05qVXpPRFJoT1dOaFptSmpaQ0lzSW1wMGFTSTZJbUl5WmpRM09XTTFMVEl3TlRndE5ESTROaTFoTnpCa0xXWTJNelk1TmpZeU5qWmtaU0lzSW01aVppSTZNVFkyTXpNeU9ESXlOU3dpYVhOeklqb2laR2xrT21WMGFISTZjbWx1YTJWaWVUb3dlREF5TkRGaFltUTJOakprWVRBMlpEQmhaakptTURFMU1tRTRNR0pqTURNM1pqWTFZVGRtT1RBeE1UWXdZMlpsTVdWaU16Vmxaak5tTUdNMU16SmhNbUUwWkNKOS5sYlVxSFBDa2dCdFhfdXVsaF8zSlJZSzJHS2lyVUNSZ0pEVUs1SWRWSTU1dkc2YU9UazZVdEVlekgzajRIM1ZCODVlQ21KbV9tRk03S3M2T09aQ1ZmQSJdfSwibmJmIjoxNjY3OTExMzg5LCJpc3MiOiJkaWQ6ZXRocjoweDU6MHhiNjY2NTEyOGVlOTFkODQ1OTBmNzBjMzI2ODc2NTM4NGE5Y2FmYmNkIn0.oVLAXFtdL_DrT7Qr9YjSfWwXYv9E2IlMAHVVVLswzQlS-bCpH3-RrlUEpJRljg-ajnk72FuDs-Mzkxa7CmvW5g',
  },
};

const defaultSnapState: SSISnapState = {
  accountState: {
    '0xb6665128eE91D84590f70c3268765384A9CAfBCd': getEmptyAccountState(),
  },
  snapConfig: {
    dApp: {
      disablePopups: false,
      friendlyDapps: [],
    },
    snap: {
      infuraToken: '0ec03090465d400c988a14831aacfe37',
      acceptedTerms: true,
    },
  },
};

export const getDefaultSnapState = (): SSISnapState => {
  defaultSnapState.accountState[address].publicKey = publicKey;
  return cloneDeep(defaultSnapState);
};

export const snapConfirmParams: SnapConfirmParams = {
  prompt: 'Test prompt',
  description: 'Test description',
  textAreaContent: 'Test text area content',
};

export const bip44Entropy: JsonBIP44CoinTypeNode = {
  depth: 2,
  parentFingerprint: 2220627503,
  index: 2147483708,
  privateKey:
    'dd5b8deefcf550f3ecb0a49b2018ef9fb5b5c2ad146478d3633bf7ce5a5a2f17',
  publicKey:
    '043efeddf040859e8d00620b6eb1bf255d82e7fc34cb0eaffc305fe69685454163910ea2cc84a617f3f4e30b74bdbcf14b884f092e8d0dc8d966e904bd988b3a94',
  chainCode: '006c9539cb5984e48b8ca8e8f1648c92ed2dccc3e6a7043cdcabc681e054b627',
  coin_type: 60,
  path: "m / bip32:44' / bip32:60'",
};

export const derivedKeyChainCode =
  '0xbbfe64aaa2157420865e979f19bdd0da7af456d075d7e4d4bb1ee92e548ac440';
export const derivedKeyDerivationPath =
  "m / bip32:44' / bip32:60' / bip32:0' / bip32:0";
