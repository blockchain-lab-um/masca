/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { IDIDManager, IKeyManager, TAgent } from '@veramo/core-types';

type ConfiguredAgent = TAgent<IDIDManager & IKeyManager>;

export default (testContext: {
  getAgent: () => ConfiguredAgent;
  setup: () => Promise<boolean>;
  tearDown: () => Promise<boolean>;
}) => {
  describe('DID manager', () => {
    let agent: ConfiguredAgent;
    // Review keyTypes used in the tests
    const keytypes = ['Ed25519', 'X25519', 'Secp256k1', 'Secp256r1'];

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
    });

    afterAll(testContext.tearDown);

    it.each(keytypes)(
      'should create did:pluginTemplate identifier with key type %s, without private key import',
      async (keyType) => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:pluginTemplate',
          options: {
            keyType,
          },
        });

        expect(identifier.provider).toBe('did:pluginTemplate');

        expect.assertions(1);
      }
    );

    it.todo(
      'should create did:pluginTemplate identifier (Ed25519)',
      async () => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:pluginTemplate',
          options: {
            keyType: 'Ed25519',
            privateKeyHex:
              '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
          },
        });

        expect(identifier).toStrictEqual({
          controllerKeyId: '',
          did: '',
          keys: [
            {
              kid: '',
              kms: '',
              meta: {
                algorithms: [''],
              },
              publicKeyHex: '',
              type: '',
            },
          ],
          provider: 'did:pluginTemplate',
          services: [],
        });

        expect.assertions(1);
      }
    );

    it.todo(
      'should create did:pluginTemplate identifier (X25519)',
      async () => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:pluginTemplate',
          options: {
            keyType: 'X25519',
            privateKeyHex:
              '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
          },
        });

        expect(identifier).toStrictEqual({
          controllerKeyId: '',
          did: '',
          keys: [
            {
              kid: '',
              kms: '',
              meta: {
                algorithms: [''],
              },
              publicKeyHex: '',
              type: '',
            },
          ],
          provider: 'did:pluginTemplate',
          services: [],
        });

        expect.assertions(1);
      }
    );

    it.todo(
      'should create did:pluginTemplate identifier (Secp256k1)',
      async () => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:pluginTemplate',
          options: {
            keyType: 'Secp256k1',
            privateKeyHex:
              '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
          },
        });

        expect(identifier).toStrictEqual({
          controllerKeyId: '',
          did: '',
          keys: [
            {
              kid: '',
              kms: '',
              meta: {
                algorithms: [''],
              },
              publicKeyHex: '',
              type: '',
            },
          ],
          provider: 'did:pluginTemplate',
          services: [],
        });

        expect.assertions(1);
      }
    );

    it.todo(
      'should create did:pluginTemplate identifier (Secp256r1)',
      async () => {
        const identifier = await agent.didManagerCreate({
          provider: 'did:pluginTemplate',
          options: {
            keyType: 'Secp256r1',
            privateKeyHex:
              '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae',
          },
        });

        expect(identifier).toStrictEqual({
          controllerKeyId: '',
          did: '',
          keys: [
            {
              kid: '',
              kms: '',
              meta: {
                algorithms: [''],
              },
              publicKeyHex: '',
              type: '',
            },
          ],
          provider: 'did:pluginTemplate',
          services: [],
        });

        expect.assertions(1);
      }
    );

    it.todo(
      'should resolve did:pluginTemplate identifier (Ed25519)',
      async () => {
        const didDoc = {};
        expect(didDoc).toStrictEqual({});

        expect.assertions(1);
      }
    );

    it.todo('should resolve did:key identifier (Secp256k1)', async () => {});
  });
};
