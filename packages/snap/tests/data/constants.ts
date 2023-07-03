import { MinimalImportableKey } from '@veramo/core';

export const mnemonic =
  'prosper pair similar canoe work humble loud wild aunt reunion olive obscure';
export const account = '0xb6665128eE91D84590f70c3268765384A9CAfBCd';
export const account2 = '0x461e557A07AC110BC947F18b3828e26f013dac39';
export const privateKey =
  '0x63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae';
export const privateKey2 =
  '0xb29764680b2a07fa4a762d255e3f689fb5c05cc885e6dfd3de5d5948b5a6b47f';

export const didMethodAccountMapping = {
  'did:key': {
    privateKey:
      '0xe575b0914215561e7b78838e40e1a8c3d67dc726f67ac052919288814b9ff717',
    publicKey:
      '0x04998c238b37415171005ff4965056819b7ee4218bfdb45b85ce33a7b12561b69b3b4176b0789ad027da6c726b874dcc680933b68f440a85d38e67a733e1f6becc',
    address: '0x64B2095542bAa166266A5EEdb5c934AF6186e710',
    addressIndex: 0,
    accountIndex: 1111903012,
    derivationPath: "m / bip32:44' / bip32:1236' / bip32:1111903012' / bip32:0",
  },
  'did:jwk': {
    privateKey:
      '0x6ff3368eebbe4d72e0f8b44404c4a391adecffb16efffce4cb8f42dffdf68b73',
    publicKey:
      '0x04792325ee943577ffc1b3c257dd8268530799acb56f7e6487137b681f3b349f374a18f9bb715b0420dfcc3fd81089e655d55180c50e3ad7b0fc895d2693a09e27',
    address: '0xb2A1AE512c703184e8b43708CEAdD68D4eBb38Df',
    addressIndex: 1,
    accountIndex: 1111903012,
    derivationPath: "m / bip32:44' / bip32:1236' / bip32:1111903012' / bip32:0",
  },
  'did:ethr': {
    privateKey:
      '0x4dbf66e4ba578040e523e5c4df34bd7b6f3440177732c126d0bbc6cde5ab6b15',
    publicKey:
      '0x04698e12e94e076822cede99ae5d0e54f0156c7846accebb23b74340a7c5e27cbce036f54264147c8b6f529cfb59608abf9c8ee41db0945f6458677c245c7ed9cf',
    address: '0xb6665128eE91D84590f70c3268765384A9CAfBCd',
    addressIndex: 3,
    accountIndex: 1111903012,
    derivationPath: "m / bip32:44' / bip32:1236' / bip32:1111903012' / bip32:0",
  },
};

export const importablePrivateKey: MinimalImportableKey = {
  kid: 'importedTestKey',
  kms: 'snap',
  type: 'Secp256k1',
  privateKeyHex: privateKey.substring(2),
} as const;

// Query params

// For exampleJWT.json
export const jsonPath =
  '$[?(@.data.credentialSubject.placeOfBirth == "Asgard")]';

// For exampleJWT_2.json & VCs returned by createTestVCs()
export const jsonPath2 =
  '$[?(@.data.credentialSubject.accomplishmentType == "Developer Certificate")]';

// Errors

export const resolutionNotFound = {
  didDocument: null,
  didResolutionMetadata: {
    error: 'invalidDid',
    message: 'Error: invalidDid: invalid key type',
  },
  didDocumentMetadata: {},
};

export const resolutionMethodNotSupported = {
  didDocument: null,
  didResolutionMetadata: {
    error: 'unsupportedDidMethod',
  },
  didDocumentMetadata: {},
};

export const resolutionInvalidDID = {
  didDocument: null,
  didResolutionMetadata: {
    error: 'invalidDid',
    message: 'Not a valid did:ethr: 0x5:0x123',
  },
  didDocumentMetadata: {},
};
