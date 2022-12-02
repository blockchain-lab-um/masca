import { Injectable } from '@nestjs/common';
import {
  createAgent,
  IDIDManager,
  IResolver,
  IKeyManager,
  TAgent,
} from '@veramo/core';
import { DataSource } from 'typeorm';
import {
  Entities,
  KeyStore,
  DIDStore,
  PrivateKeyStore,
  migrations,
} from '@veramo/data-store';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { ConfigService } from '@nestjs/config';
import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { KeyDIDProvider, getDidKeyResolver } from '@veramo/did-provider-key';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { Resolver } from 'did-resolver';
import { IConfig } from 'src/config/configuration';

@Injectable()
export class AgentService {
  private agent: TAgent<IDIDManager & IKeyManager & IResolver>;

  private dbConnection: DataSource;

  private providerConfig: { networks: { name: string; rpcUrl: string }[] };

  constructor(private configService: ConfigService<IConfig, true>) {
    this.dbConnection = new DataSource({
      type: 'sqlite',
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

    this.agent = createAgent<IDIDManager & IKeyManager & IResolver>({
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
      ],
    });
  }

  async initializeAgent() {
    try {
      // Check if key exists
      await this.agent.keyManagerGet({
        kid: 'main-key',
      });
    } catch (error) {
      // Create key if it doesn't exist
      await this.agent.keyManagerImport({
        kid: 'main-key',
        kms: 'local',
        type: 'Secp256k1',
        privateKeyHex: this.configService.get<string>('ISSUER_PRIVATE_KEY'),
      });
      console.log('Key not found, creating new key...');
    }
  }

  getAgent(): TAgent<IDIDManager & IKeyManager & IResolver> {
    return this.agent;
  }
}
export default AgentService;
