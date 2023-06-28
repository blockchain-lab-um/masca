export const exampleDIDEthrMainnet =
  'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85';
export const exampleDIDEthrMainnetDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  ],
  id: 'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85',
  verificationMethod: [
    {
      id: 'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controller',
      type: 'EcdsaSecp256k1RecoveryMethod2020',
      controller:
        'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85',
      blockchainAccountId:
        'eip155:1:0xb6665128eE91D84590f70c3268765384A9CAfBCd',
    },
    {
      id: 'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controllerKey',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller:
        'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85',
      publicKeyHex:
        '0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85',
    },
  ],
  authentication: [
    'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controller',
    'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controllerKey',
  ],
  assertionMethod: [
    'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controller',
    'did:ethr:0x1:0x0280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85#controllerKey',
  ],
};
