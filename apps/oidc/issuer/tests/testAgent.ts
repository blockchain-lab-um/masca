import { IOIDCPlugin, OIDCPlugin } from '@blockchain-lab-um/oidc-rp-plugin';
import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
} from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  Entities,
  KeyStore,
  DIDStore,
  PrivateKeyStore,
  migrations,
} from '@veramo/data-store';
import { DataSource } from 'typeorm';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { KeyDIDProvider, getDidKeyResolver } from '@veramo/did-provider-key';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { loadSupportedCredentials } from '../src/config/configuration';
import {
  TEST_INFURA_PROJECT_ID,
  TEST_ISSUER_DB_SECRET,
  TEST_ISSUER_URL,
  TEST_SUPPORTED_CURVES,
  TEST_SUPPORTED_DID_METHODS,
  TEST_SUPPORTED_DIGITAL_SIGNATURES,
} from './constants';

export type Agent = TAgent<
  IDIDManager & IKeyManager & IResolver & IOIDCPlugin & ICredentialPlugin
>;

const getAgent = async (): Promise<Agent> => {
  const providerConfig = {
    networks: [
      {
        name: 'mainnet',
        rpcUrl: `https://mainnet.infura.io/v3/${TEST_INFURA_PROJECT_ID}`,
      },
      {
        name: 'goerli',
        rpcUrl: `https://goerli.infura.io/v3/$${TEST_INFURA_PROJECT_ID}`,
      },
    ],
  };

  const dbConnection = new DataSource({
    type: 'sqlite',
    database: 'database.oidc-demo.issuer.test',
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
  });

  return createAgent<
    IDIDManager & IKeyManager & IResolver & IOIDCPlugin & ICredentialPlugin
  >({
    plugins: [
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(
              dbConnection,
              new SecretBox(TEST_ISSUER_DB_SECRET)
            )
          ),
        },
      }),
      // Change and only support from the config file
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: 'did:ethr',
        providers: {
          'did:ethr': new EthrDIDProvider({
            defaultKms: 'local',
            networks: providerConfig.networks,
          }),
          'did:key': new KeyDIDProvider({
            defaultKms: 'local',
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...getEthrResolver(providerConfig),
          ...getDidKeyResolver(),
        }),
      }),
      new OIDCPlugin({
        url: TEST_ISSUER_URL,
        db_secret: TEST_ISSUER_DB_SECRET,
        supported_curves: TEST_SUPPORTED_CURVES,
        supported_did_methods: TEST_SUPPORTED_DID_METHODS,
        supported_digital_signatures: TEST_SUPPORTED_DIGITAL_SIGNATURES,
        supported_credentials: loadSupportedCredentials(),
      }),
      new CredentialPlugin(),
    ],
  });
};

export default getAgent;
