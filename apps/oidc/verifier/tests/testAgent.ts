import { IOIDCRPPlugin, OIDCRPPlugin } from '@blockchain-lab-um/oidc-rp-plugin';
import {
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
  createAgent,
} from '@veramo/core';
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from '@veramo/credential-eip712';
import {
  CredentialIssuerLD,
  ICredentialIssuerLD,
  LdDefaultContexts,
  VeramoEcdsaSecp256k1RecoverySignature2020,
  VeramoEd25519Signature2018,
} from '@veramo/credential-ld';
import { CredentialPlugin } from '@veramo/credential-w3c';
import {
  DIDStore,
  Entities,
  KeyStore,
  PrivateKeyStore,
  migrations,
} from '@veramo/data-store';
import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { KeyDIDProvider, getDidKeyResolver } from '@veramo/did-provider-key';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { DataSource } from 'typeorm';

import {
  TEST_INFURA_PROJECT_ID,
  TEST_SUPPORTED_CURVES,
  TEST_SUPPORTED_DID_METHODS,
  TEST_SUPPORTED_DIGITAL_SIGNATURES,
  TEST_VERIFIER_DB_SECRET,
  TEST_VERIFIER_URL,
} from './constants.js';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IResolver &
    IOIDCRPPlugin &
    ICredentialPlugin &
    ICredentialIssuerEIP712 &
    ICredentialIssuerLD
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
    database: 'database.oidc-demo.verifier.test',
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
  });

  return createAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      IOIDCRPPlugin &
      ICredentialPlugin &
      ICredentialIssuerEIP712 &
      ICredentialIssuerLD
  >({
    plugins: [
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(
              dbConnection,
              new SecretBox(TEST_VERIFIER_DB_SECRET)
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
      new OIDCRPPlugin({
        url: TEST_VERIFIER_URL,
        db_secret: TEST_VERIFIER_DB_SECRET,
        supported_curves: TEST_SUPPORTED_CURVES,
        supported_did_methods: TEST_SUPPORTED_DID_METHODS,
        supported_digital_signatures: TEST_SUPPORTED_DIGITAL_SIGNATURES,
      }),
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new CredentialIssuerLD({
        contextMaps: [LdDefaultContexts],
        suites: [
          new VeramoEcdsaSecp256k1RecoverySignature2020(),
          new VeramoEd25519Signature2018(),
        ],
      }),
    ],
  });
};

export default getAgent;
