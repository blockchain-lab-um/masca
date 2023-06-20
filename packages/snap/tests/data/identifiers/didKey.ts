export const exampleDIDKeyIdentifier =
  'zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG';
export const exampleDIDKey = `did:key:${exampleDIDKeyIdentifier}`;
export const exampleDIDKeyDocument = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security#EcdsaSecp256k1VerificationKey2019",
    "https://w3id.org/security#publicKeyJwk",
  ],
  "id": "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG",
  "verificationMethod": [
    {
      "id": "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG",
      "publicKeyJwk": {
        "alg": "ES256K",
        "kty": "EC",
        "use": "sig",
        "crv": "secp256k1",
        "x": "mYwjizdBUXEAX_SWUFaBm37kIYv9tFuFzjOnsSVhtps",
        "y": "O0F2sHia0CfabHJrh03MaAkzto9ECoXTjmenM-H2vsw"
      }
    }
  ],
  "authentication": [
    "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG"
  ],
  "assertionMethod": [
    "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG#zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG"
  ]
}

export const exampleDIDKeyImportedAccount = {"controllerKeyId": "metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd", "did": "did:key:zQ3shXkB5EzLZ9rPa4Pr6nf4zuUMcmN4KyHZg9EjaNnQzx3PG", "keys": [{"kid": "metamask-0xb6665128eE91D84590f70c3268765384A9CAfBCd", "kms": "snap", "meta": {"algorithms": ["ES256K", "ES256K-R", "eth_signTransaction", "eth_signTypedData", "eth_signMessage", "eth_rawSign"]}, "publicKeyHex": "04998c238b37415171005ff4965056819b7ee4218bfdb45b85ce33a7b12561b69b3b4176b0789ad027da6c726b874dcc680933b68f440a85d38e67a733e1f6becc", "type": "Secp256k1"}], "provider": "did:key", "services": []}