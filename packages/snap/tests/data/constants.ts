export const mnemonic =
  'prosper pair similar canoe work humble loud wild aunt reunion olive obscure';
export const account = '0xb6665128eE91D84590f70c3268765384A9CAfBCd';
export const account2 = '0x461e557A07AC110BC947F18b3828e26f013dac39';
export const privateKey =
  '0x63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae';
export const privateKey2 =
  '0xb29764680b2a07fa4a762d255e3f689fb5c05cc885e6dfd3de5d5948b5a6b47f';



// Query params

export const jsonPath =
  '$[?(@.data.credentialSubject.placeOfBirth == "Asgard")]';


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