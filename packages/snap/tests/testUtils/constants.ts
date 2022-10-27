import { SnapConfirmParams, SSISnapState } from '../../src/interfaces';
import cloneDeep from 'lodash.clonedeep';
import { getEmptyAccountState } from '../../src/utils/config';
import { IIdentifier } from '@veramo/core';

export const privateKey =
  '0x63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae';
export const address = '0xb6665128eE91D84590f70c3268765384A9CAfBCd';
export const publicKey =
  '0x0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a';
export const signedMsg =
  '0x30eb4dbf93e7bfdb109ed03f7803f2378fa27d18ddc233cb3d121b5ba13253fe2515076d1ba66f3dc282c182479b843c925c62eb1f5a0676bcaf995e8e7552941c';
export const infuraToken = '0ec03090465d400c988a14831aacfe37';

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
      privateKeyHex: '',
      publicKeyHex: '',
      meta: {
        provider: 'metamask',
        account: '0xb6665128ee91d84590f70c3268765384a9cafbcd',
        algorithms: ['eth_signMessage', 'eth_signTypedData'],
      },
    },
  ],
  services: [],
};

export const exampleImportedDIDWIthoutPrivateKey: IIdentifier = {
  did: 'did:ethr:0x5:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  provider: 'did:ethr',
  controllerKeyId: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
  keys: [
    {
      kid: 'metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd',
      type: 'Secp256k1',
      kms: 'web3',
      publicKeyHex: '',
      meta: {
        provider: 'metamask',
        account: '0xb6665128ee91d84590f70c3268765384a9cafbcd',
        algorithms: ['eth_signMessage', 'eth_signTypedData'],
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
