import type { IDIDManager, IKeyManager, TAgent } from '@veramo/core-types';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

type ConfiguredAgent = TAgent<IDIDManager & IKeyManager>;

export default (testContext: {
  getAgent: () => ConfiguredAgent;
  setup: () => Promise<boolean>;
  tearDown: () => Promise<boolean>;
}) => {
  describe('DID manager', () => {
    let agent: ConfiguredAgent;
    const keytypes = ['Ed25519', 'X25519', 'Secp256k1', 'Secp256r1'];

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
    });

    afterAll(async () => {
      await testContext.tearDown();
    });

    it.each(keytypes)(
      'should create did:key identifier with key type %s, without private key import',
      async (keyType) => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:key',
          options: {
            keyType,
          },
        });

        expect(identifier.provider).toBe('did:key');

        expect.assertions(1);
      }
    );

    it.each(keytypes)(
      'should create did:key identifier (EBSI) with key type %s',
      async (keyType) => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:key',
          options: {
            keyType,
            type: 'ebsi',
          },
        });

        expect(identifier.provider).toBe('did:key');

        expect.assertions(1);
      }
    );

    it('should create did:key identifier (Ed25519)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Ed25519',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          'ee3702c6af9f456fab737ec4c6708fbcaa6d3d9c1d1cc0f5b0f35b6678cff19c',
        did: 'did:key:z6MkvV9jG1VyhUYjMuo67dKEmEevHqeL5F9m6FLtWvGU2QZh',
        keys: [
          {
            kid: 'ee3702c6af9f456fab737ec4c6708fbcaa6d3d9c1d1cc0f5b0f35b6678cff19c',
            kms: 'local',
            meta: {
              algorithms: ['Ed25519', 'EdDSA'],
            },
            publicKeyHex:
              'ee3702c6af9f456fab737ec4c6708fbcaa6d3d9c1d1cc0f5b0f35b6678cff19c',
            type: 'Ed25519',
          },
        ],
        provider: 'did:key',
        services: [],
      });

      expect.assertions(1);
    });

    it('should create did:key identifier (X25519)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'X25519',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          'd6a490bf2b4f793c19bdd60584401ae25dd7b5ac5a1c5f6886c8b0cfde9c2b47',
        did: 'did:key:z6LSr83xLED4sD1MkZr4daovyH4HNCHgqc25N52vK2soUc4N',
        keys: [
          {
            kid: 'd6a490bf2b4f793c19bdd60584401ae25dd7b5ac5a1c5f6886c8b0cfde9c2b47',
            kms: 'local',
            meta: {
              algorithms: ['ECDH', 'ECDH-ES', 'ECDH-1PU'],
            },
            publicKeyHex:
              'd6a490bf2b4f793c19bdd60584401ae25dd7b5ac5a1c5f6886c8b0cfde9c2b47',
            type: 'X25519',
          },
        ],
        provider: 'did:key',
        services: [],
      });

      expect.assertions(1);
    });

    it('should create did:key identifier (Secp256k1)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256k1',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a',
        did: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
        keys: [
          {
            kid: '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a',
            kms: 'local',
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
              '0480a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae850a9f561d414001a8bdefdb713c619d2caf08a0c9655b0cf42de065bc51e0169a',
            type: 'Secp256k1',
          },
        ],
        provider: 'did:key',
        services: [],
      });

      expect.assertions(1);
    });

    it('should create did:key identifier (Secp256r1)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256r1',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          '033b2ee13287ae5d35ef26dd2169c665d1a2771d1f85843367d15ba9c0b6d8d5e3',
        did: 'did:key:zDnaemeJvzACkb7K8yRSRCeTKHGtCyXs6e2UxsDD6SFtxnx8z',
        keys: [
          {
            kid: '033b2ee13287ae5d35ef26dd2169c665d1a2771d1f85843367d15ba9c0b6d8d5e3',
            kms: 'local',
            meta: {
              algorithms: ['ES256'],
            },
            publicKeyHex:
              '033b2ee13287ae5d35ef26dd2169c665d1a2771d1f85843367d15ba9c0b6d8d5e3',
            type: 'Secp256r1',
          },
        ],
        provider: 'did:key',
        services: [],
      });

      expect.assertions(1);
    });

    it('should create did:key identifier (EBSI)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256k1',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6af',
          type: 'ebsi',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          '04bc44732939b07a44bdbf87085baf74c6705d6a742e753cbd811932d6187068424e7065bd9b5b243603e57b6b6601866b9518751c5d147e2f25f66706978905bd',
        did: 'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        keys: [
          {
            kid: '04bc44732939b07a44bdbf87085baf74c6705d6a742e753cbd811932d6187068424e7065bd9b5b243603e57b6b6601866b9518751c5d147e2f25f66706978905bd',
            kms: 'local',
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
              '04bc44732939b07a44bdbf87085baf74c6705d6a742e753cbd811932d6187068424e7065bd9b5b243603e57b6b6601866b9518751c5d147e2f25f66706978905bd',
            type: 'Secp256k1',
          },
        ],
        provider: 'did:key',
        services: [],
      });

      expect.assertions(1);
    });

    it('should resolve did:key identifier (Ed25519)', async () => {
      const didUrl = 'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9';
      const result = await agent.resolveDid({ didUrl });
      const didDoc = result.didDocument;

      expect(didDoc).toStrictEqual({
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/ed25519-2020/v1',
          'https://w3id.org/security/suites/x25519-2020/v1',
        ],
        id: 'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
        verificationMethod: [
          {
            id: 'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9#z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
            type: 'Ed25519VerificationKey2020',
            controller:
              'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
            publicKeyMultibase:
              'z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
          },
        ],
        authentication: [
          'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9#z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
        ],
        assertionMethod: [
          'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9#z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
        ],
        keyAgreement: [
          {
            id: 'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9#59de720a234205d4966be028a13ff252c1c7dd80092728411da3ef0ca146593a',
            type: 'X25519KeyAgreementKey2020',
            controller:
              'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
            publicKeyMultibase:
              '59de720a234205d4966be028a13ff252c1c7dd80092728411da3ef0ca146593a',
          },
        ],
      });

      expect.assertions(1);
    });

    it('should resolve did:key identifier (Secp256k1)', async () => {
      const didUrl =
        'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik';
      const result = await agent.resolveDid({ didUrl });
      const didDoc = result.didDocument;

      expect(didDoc).toStrictEqual({
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
          'https://w3id.org/security#publicKeyJwk',
        ],
        id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
        verificationMethod: [
          {
            id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
            type: 'EcdsaSecp256k1VerificationKey2019',
            controller:
              'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
            publicKeyJwk: {
              alg: 'ES256K',
              kty: 'EC',
              crv: 'secp256k1',
              use: 'sig',
              x: 'gKnNSP1Db4wfgbFW62FWGM1XPD6x5tk3oXuCIgJ8roU',
              y: 'Cp9WHUFAAai979txPGGdLK8IoMllWwz0LeBlvFHgFpo',
            },
          },
        ],
        authentication: [
          'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
        ],
        assertionMethod: [
          'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
        ],
      });

      expect.assertions(1);
    });

    it('should resolve did:key identifier (EBSI)', async () => {
      const didUrl =
        'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A';
      const result = await agent.resolveDid({ didUrl });
      const didDoc = result.didDocument;

      expect(didDoc).toStrictEqual({
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
        ],
        id: 'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        verificationMethod: [
          {
            id: 'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A#zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
            type: 'JsonWebKey2020',
            controller:
              'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'vERzKTmwekS9v4cIW690xnBdanQudTy9gRky1hhwaEI',
              y: 'TnBlvZtbJDYD5XtrZgGGa5UYdRxdFH4vJfZnBpeJBb0',
            },
          },
        ],
        authentication: [
          'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A#zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        ],
        assertionMethod: [
          'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A#zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        ],
        capabilityInvocation: [
          'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A#zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        ],
        capabilityDelegation: [
          'did:key:zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A#zBhBLmYmyihtomRdJJNEKzbPj51o4a3GYFeZoRHSABKUwqdjiQPY2gGUYckfRXAFJdwJVD5cgJ2C27D5U2uXsF5Cnn4Er6U7BL4a5rvqjWNxC8y19htTFR63EPnZRCqWBQTH3NKdZyKCFqdh4kiZmvb5ndFmPtg56VrHfbpx53uYKZXonU4W65A',
        ],
      });

      expect.assertions(1);
    });
  });
};
