export const didIonResult = {
  did: 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
  didDocumentMetadata: {
    method: {
      published: true,
      recoveryCommitment: 'EiDKYXZ2MkHRCYDVtXI7ONiTkTdVfs9Tnb-tDDHGXLzmOw',
      updateCommitment: 'EiDNk40DUvxCef8_BinU5DDIAhNWE4e7Ea9Q6P7GAbJ6VA',
    },
    canonicalId: 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
  },
  didResolutionMetadata: {
    contentType: 'application/did+ld+json',
    pattern: '^(did:ion:(?!test).+)$',
    driverUrl: 'http://driver-did-ion:8080/1.0/identifiers/',
    duration: 21,
    did: {
      didString: 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
      methodSpecificId: 'EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
      method: 'ion',
    },
  },
  didDocument: {
    id: 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        '@base': 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
      },
    ],
    service: [
      {
        id: '#linkedin',
        type: 'linkedin',
        serviceEndpoint: 'linkedin.com/in/henry-tsai-6b884014',
      },
      {
        id: '#github',
        type: 'github',
        serviceEndpoint: 'github.com/thehenrytsai',
      },
    ],
    verificationMethod: [
      {
        id: '#someKeyId',
        controller: 'did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk: {
          kty: 'EC',
          crv: 'secp256k1',
          x: 'WfY7Px6AgH6x-_dgAoRbg8weYRJA36ON-gQiFnETrqw',
          y: 'IzFx3BUGztK0cyDStiunXbrZYYTtKbOUzx16SUK0sAY',
        },
      },
    ],
    authentication: ['#someKeyId'],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};

export const didEnsResult = {
  did: 'did:ens:vitalik.eth',
  didDocumentMetadata: {},
  didResolutionMetadata: {
    pattern: '^(did:ens:.+)$',
    driverUrl: 'http://uni-resolver-driver-did-uport:8081/1.0/identifiers/',
    duration: 461,
    did: {
      didString: 'did:ens:vitalik.eth',
      methodSpecificId: 'vitalik.eth',
      method: 'ens',
    },
    contentType: 'application/did+ld+json',
    convertedFrom: 'application/did+json',
    convertedTo: 'application/did+ld+json',
  },
  didDocument: {
    assertionMethod: [
      'did:ens:vitalik.eth#0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ],
    service: [
      {
        id: 'did:ens:vitalik.eth#Web3PublicProfile-0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        type: 'Web3PublicProfile',
        serviceEndpoint: 'vitalik.eth',
      },
    ],
    capabilityDelegation: [
      'did:ens:vitalik.eth#0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ],
    id: 'did:ens:vitalik.eth',
    verificationMethod: [
      {
        id: 'did:ens:vitalik.eth#0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: 'did:ens:vitalik.eth',
        blockchainAccountId:
          '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155:1',
      },
    ],
    capabilityInvocation: [
      'did:ens:vitalik.eth#0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ],
    authentication: [
      'did:ens:vitalik.eth#0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};

export const didEbsiResult = {
  did: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd',
  didDocumentMetadata: {},
  didResolutionMetadata: {
    contentType: 'application/did+ld+json',
    pattern: '^(did:ebsi:.+)$',
    driverUrl: 'https://api-pilot.ebsi.eu/did-registry/v3/identifiers/$1',
    duration: 953,
    did: {
      didString: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd',
      methodSpecificId: 'ziE2n8Ckhi6ut5Z8Cexrihd',
      method: 'ebsi',
    },
  },
  didDocument: {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    authentication: ['did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd#key-1'],
    service: [],
    id: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd',
    assertionMethod: ['did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd#key-1'],
    verificationMethod: [
      {
        id: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd#key-1',
        controller: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd',
        type: 'JsonWebKey2020',
        publicKeyJwk: {
          kty: 'EC',
          crv: 'secp256k1',
          x: 'masUHNuJ0oH0C_e5rLUu5VKwmU2l-a7rrNTqA__afN8',
          y: 'UmGGX_WgRFXbw6qTli9xcQ0owtkZVuUGVyM23e8rZe8',
          kid: 'did:ebsi:ziE2n8Ckhi6ut5Z8Cexrihd#keys-1',
        },
      },
    ],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};

export const didCheqdResult = {
  did: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN',
  didDocumentMetadata: {
    created: '2022-04-05T11:49:19Z',
    versionId: '4fa8e367-c70e-533e-babf-3732d9761061',
  },
  didResolutionMetadata: {
    contentType: 'application/did+ld+json',
    retrieved: '2023-06-01T09:34:29Z',
    did: {
      didString: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN',
      methodSpecificId: 'mainnet:Ps1ysXP2Ae6GBfxNhNQNKN',
      method: 'cheqd',
    },
    pattern: '^(did:cheqd:.+)$',
    driverUrl: 'http://cheqd-did-driver:8080/1.0/identifiers/$1',
    duration: 1034,
  },
  didDocument: {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
    id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN',
    verificationMethod: [
      {
        id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#key1',
        type: 'Ed25519VerificationKey2020',
        controller: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN',
        publicKeyMultibase: 'z6Mkta7joRuvDh7UnoESdgpr9dDUMh5LvdoECDi3WGrJoscA',
      },
    ],
    authentication: ['did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#key1'],
    service: [
      {
        id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#website',
        type: 'LinkedDomains',
        serviceEndpoint: ['https://www.cheqd.io'],
      },
      {
        id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#non-fungible-image',
        type: 'LinkedDomains',
        serviceEndpoint: [
          'https://gateway.ipfs.io/ipfs/bafybeihetj2ng3d74k7t754atv2s5dk76pcqtvxls6dntef3xa6rax25xe',
        ],
      },
      {
        id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#twitter',
        type: 'LinkedDomains',
        serviceEndpoint: ['https://twitter.com/cheqd_io'],
      },
      {
        id: 'did:cheqd:mainnet:Ps1ysXP2Ae6GBfxNhNQNKN#linkedin',
        type: 'LinkedDomains',
        serviceEndpoint: ['https://www.linkedin.com/company/cheqd-identity/'],
      },
    ],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};

export const didWebResult = {
  did: 'did:web:did.actor:alice',
  didDocumentMetadata: {},
  didResolutionMetadata: {
    contentType: 'application/did+ld+json',
    pattern: '^(did:web:.+)$',
    driverUrl: 'http://uni-resolver-driver-did-uport:8081/1.0/identifiers/',
    duration: 139,
    did: {
      didString: 'did:web:did.actor:alice',
      methodSpecificId: 'did.actor:alice',
      method: 'web',
    },
  },
  didDocument: {
    '@context': [
      'https://w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2018/v1',
    ],
    id: 'did:web:did.actor:alice',
    publicKey: [
      {
        id: 'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
        controller: 'did:web:did.actor:alice',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'DK7uJiq9PnPnj7AmNZqVBFoLuwTjT1hFPrk6LSjZ2JRz',
      },
    ],
    authentication: [
      'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
    ],
    assertionMethod: [
      'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
    ],
    capabilityDelegation: [
      'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
    ],
    capabilityInvocation: [
      'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
    ],
    keyAgreement: [
      {
        id: 'did:web:did.actor:alice#zC8GybikEfyNaausDA4mkT4egP7SNLx2T1d1kujLQbcP6h',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:web:did.actor:alice',
        publicKeyBase58: 'CaSHXEvLKS6SfN9aBfkVGBpp15jSnaHazqHgLHp8KZ3Y',
      },
    ],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};

export const didPolygonidResult = {
  did: 'did:polygonid:polygon:mumbai:2qDj9EDytmvtQP1or3FxykXGEaqSA1ss479MYHDMJc',
  didDocumentMetadata: {},
  didResolutionMetadata: {
    contentType: 'application/did+ld+json',
    retrieved: '2023-06-01T09:37:10.470709392Z',
    pattern: '^(did:polygonid:.+)$',
    driverUrl: 'http://driver-did-polygonid:8080/1.0/identifiers/',
    duration: 418,
    did: {
      didString:
        'did:polygonid:polygon:mumbai:2qDj9EDytmvtQP1or3FxykXGEaqSA1ss479MYHDMJc',
      methodSpecificId:
        'polygon:mumbai:2qDj9EDytmvtQP1or3FxykXGEaqSA1ss479MYHDMJc',
      method: 'polygonid',
    },
  },
  didDocument: {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://schema.iden3.io/core/jsonld/auth.jsonld',
    ],
    id: 'did:polygonid:polygon:mumbai:2qDj9EDytmvtQP1or3FxykXGEaqSA1ss479MYHDMJc',
    authentication: [
      {
        id: 'did:polygonid:polygon:mumbai:2qDj9EDytmvtQP1or3FxykXGEaqSA1ss479MYHDMJc',
        type: 'Iden3StateInfo2023',
        blockchainAccountId: '80001:0x134B1BE34911E39A8397ec6289782989729807a4',
        published: false,
        global: {
          root: 'e3df6f37741f9679280188bb5456fe9de3efbf597227e315328e5f8b8a2bcc27',
          replacedByRoot:
            '0000000000000000000000000000000000000000000000000000000000000000',
          createdAtTimestamp: '1685611195',
          replacedAtTimestamp: '0',
          createdAtBlock: '36305752',
          replacedAtBlock: '0',
        },
      },
    ],
  },
  '@context': 'https://w3id.org/did-resolution/v1',
};
