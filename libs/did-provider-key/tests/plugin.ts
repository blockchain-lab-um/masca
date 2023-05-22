/* eslint-disable import/no-extraneous-dependencies */
import {
  IDIDManager,
  IIdentifier,
  IKeyManager,
  TAgent,
} from '@veramo/core-types';

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
      return true;
    });
    afterAll(testContext.tearDown);

    let identifier: IIdentifier;
    it('should create did:key identifier', async () => {
      identifier = await agent.didManagerCreate({
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
    });

    it('should create did:key ebsi identifier', async () => {
      identifier = await agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256k1',
          privateKeyHex:
            '63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6af',
          type: 'ebsi',
        },
      });

      expect(identifier).toBe('identifier');
    });
  });
};
