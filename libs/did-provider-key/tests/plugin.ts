import type { IDIDManager, IKeyManager, TAgent } from '@veramo/core-types';

type ConfiguredAgent = TAgent<IDIDManager & IKeyManager>;

// eslint-disable-next-line jest/no-export
export default (testContext: {
  getAgent: () => ConfiguredAgent;
  setup: () => Promise<boolean>;
  tearDown: () => Promise<boolean>;
}) => {
  describe('DID manager', () => {
    let agent: ConfiguredAgent;

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
    });

    afterAll(testContext.tearDown);

    it('should create did:key identifier (Secp256k1), without private key import', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256k1',
        },
      });

      expect(identifier.provider).toBe('did:key');
      expect.assertions(1);
    });

    it('should create did:key identifier (Ed25519), without private key import', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Ed25519',
        },
      });

      expect(identifier.provider).toBe('did:key');
      expect.assertions(1);
    });

    it('should create did:key identifier (X25519), without private key import', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'X25519',
        },
      });

      expect(identifier.provider).toBe('did:key');
      expect.assertions(1);
    });

    it('should create did:key ebsi identifier without key import', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          type: 'ebsi',
        },
      });

      expect(identifier.provider).toBe('did:key');
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

    it('should create did:key identifier (Ed25519)', async () => {
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Ed25519',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        },
      });

      expect(identifier).toStrictEqual({
        controllerKeyId:
          '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
        did: 'did:key:z6MkmArbZHXCFE744TDd6qNCLiu8JUeELNH11MjtVyHwTaW9',
        keys: [
          {
            kid: '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
            kms: 'local',
            meta: {
              algorithms: ['Ed25519', 'EdDSA'],
            },
            publicKeyHex:
              '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
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
        did: 'did:key:z6P4wgDiU76DMNYonnmvwRhi2HjKK3mAGAAUz9RQzfWmtJ5c',
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

    it('should create did:key ebsi identifier', async () => {
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

    it('should resolve key did', async () => {
      const didUrl =
        'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik';
      const result = await agent.resolveDid({ didUrl });
      const didDoc = result.didDocument;

      expect(didDoc).toStrictEqual({
        '@context': [
          'https://www.w3.org/ns/did/v1',
          {
            EcdsaSecp256k1VerificationKey2019:
              'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              '@id': 'https://w3id.org/security#publicKeyJwk',
              '@type': '@json',
            },
          },
        ],
        id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
        verificationMethod: [
          {
            id: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
            type: 'EcdsaSecp256k1VerificationKey2019',
            controller:
              'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
            publicKeyJwk: {
              kty: 'EC',
              crv: 'secp256k1',
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

    it('should resolve key did ebsi', async () => {
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