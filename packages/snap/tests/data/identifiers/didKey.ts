export const exampleDIDKeyIdentifier =
  'zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG';
export const exampleDIDKey = `did:key:${exampleDIDKeyIdentifier}`;
export const exampleDIDKeyDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
    'https://w3id.org/security#publicKeyJwk',
  ],
  id: 'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
  verificationMethod: [
    {
      id: 'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: 'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
      publicKeyJwk: {
        alg: 'ES256K',
        kty: 'EC',
        use: 'sig',
        crv: 'secp256k1',
        x: 'mYwjizdBUXEAX_SWUFaBm37kIYv9tFuFzjOnsSVhtps',
        y: 'O0F2sHia0CfabHJrh03MaAkzto9ECoXTjmenM-H2vsw',
      },
    },
  ],
  authentication: [
    'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
  ],
  assertionMethod: [
    'did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG',
  ],
};

export const exampleDIDKeyImportedAccount = {
  controllerKeyId:
    '0477d3b6b4d64b638521f78c3f862b4578c9601af4625df5771c6813edabeb876bfe372cb9aecf2f2a1d008e46d2b2fd38284051e38b85b68eaa38a1496fc537a3',
  did: 'did:key:zQ3shnhrtE43gzU9bFdGFPnDrVSmGWUZmnKinSw8LBvrWmHop',
  keys: [
    {
      kid: '0477d3b6b4d64b638521f78c3f862b4578c9601af4625df5771c6813edabeb876bfe372cb9aecf2f2a1d008e46d2b2fd38284051e38b85b68eaa38a1496fc537a3',
      kms: 'snap',
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
      publicKeyHex:
        '0477d3b6b4d64b638521f78c3f862b4578c9601af4625df5771c6813edabeb876bfe372cb9aecf2f2a1d008e46d2b2fd38284051e38b85b68eaa38a1496fc537a3',
      type: 'Secp256k1',
    },
  ],
  provider: 'did:key',
  services: [],
};
