import {
  IOIDCPlugin,
  OIDCPlugin,
  isError,
  privateKeyToDid,
} from '@blockchain-lab-um/oidc-rp-plugin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
  MinimalImportableKey,
  TAgent,
  createAgent,
} from '@veramo/core';
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
  IConfig,
  loadSupportedCredentials,
} from '../../config/configuration.js';

@Injectable()
export class AgentService {
  private agent: TAgent<
    IDIDManager & IKeyManager & IResolver & IOIDCPlugin & ICredentialPlugin
  >;

  private dbConnection: DataSource;

  private providerConfig: { networks: { name: string; rpcUrl: string }[] };

  constructor(private configService: ConfigService<IConfig, true>) {
    this.dbConnection = new DataSource({
      type: 'better-sqlite3',
      database: 'database.oidc-demo.issuer',
      synchronize: false,
      migrations,
      migrationsRun: true,
      logging: ['error', 'info', 'warn'],
      entities: Entities,
    });

    this.providerConfig = {
      networks: [
        {
          name: 'mainnet',
          rpcUrl: `https://mainnet.infura.io/v3/${this.configService.get<string>(
            'INFURA_PROJECT_ID'
          )}`,
        },
        {
          name: 'goerli',
          rpcUrl: `https://goerli.infura.io/v3/${this.configService.get<string>(
            'INFURA_PROJECT_ID'
          )}`,
        },
      ],
    };

    this.agent = createAgent<
      IDIDManager & IKeyManager & IResolver & IOIDCPlugin & ICredentialPlugin
    >({
      plugins: [
        new KeyManager({
          store: new KeyStore(this.dbConnection),
          kms: {
            local: new KeyManagementSystem(
              new PrivateKeyStore(
                this.dbConnection,
                new SecretBox(
                  this.configService.get<string>('ISSUER_DB_SECRET')
                )
              )
            ),
          },
        }),
        // Change and only support from the config file
        new DIDManager({
          store: new DIDStore(this.dbConnection),
          defaultProvider: 'did:ethr',
          providers: {
            'did:ethr': new EthrDIDProvider({
              defaultKms: 'local',
              networks: this.providerConfig.networks,
            }),
            'did:key': new KeyDIDProvider({
              defaultKms: 'local',
            }),
          },
        }),
        new DIDResolverPlugin({
          resolver: new Resolver({
            ...getEthrResolver(this.providerConfig),
            ...getDidKeyResolver(),
          }),
        }),
        new OIDCPlugin({
          url: this.configService.get<string>('ISSUER_URL'),
          db_secret: this.configService.get<string>('ISSUER_DB_SECRET'),
          supported_curves:
            this.configService.get<string[]>('SUPPORTED_CURVES'),
          supported_did_methods: this.configService.get<string[]>(
            'SUPPORTED_DID_METHODS'
          ),
          supported_digital_signatures: this.configService.get<string[]>(
            'SUPPORTED_DIGITAL_SIGNATURES'
          ),
          supported_credentials: loadSupportedCredentials(),
        }),
        new CredentialPlugin(),
      ],
    });
  }

  async initializeAgent() {
    try {
      // Check if did exists
      await this.agent.didManagerGetByAlias({
        alias: 'main-did', // TODO: Handle alias better
      });

      // console.log('Did found, skipping creation...');
    } catch (error) {
      // Create did if it doesn't exist
      const key: MinimalImportableKey = {
        kid: 'main-key',
        kms: 'local',
        type: 'Secp256k1',
        privateKeyHex: this.configService.get<string>('ISSUER_PRIVATE_KEY'),
      };

      const res = await privateKeyToDid({
        privateKey: key.privateKeyHex,
        didMethod: 'did:ethr',
      });

      if (isError(res)) {
        throw Error('Error while creating DID');
      }

      const { did } = res.data;

      await this.agent.didManagerImport({
        did,
        alias: 'main-did',
        provider: 'did:ethr',
        controllerKeyId: 'main-key', // TODO: Handle key ID better
        keys: [key],
      });

      // console.log('Did not found, creating new DID...');
    }
  }

  getAgent(): TAgent<IDIDManager & IKeyManager & IResolver & IOIDCPlugin> {
    return this.agent;
  }
}
export default AgentService;
