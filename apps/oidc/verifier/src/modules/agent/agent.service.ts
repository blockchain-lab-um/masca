import { Injectable } from '@nestjs/common';
import {
  createAgent,
  IDIDManager,
  IResolver,
  IKeyManager,
  TAgent,
  ICredentialPlugin,
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
import { CredentialPlugin } from '@veramo/credential-w3c';
import { IOIDCPlugin, OIDCPlugin } from '@blockchain-lab-um/oidc-rp-plugin';
import { IConfig, loadSupportedCredentials } from '../../config/configuration';

@Injectable()
export class AgentService {
  private agent: TAgent<
    IDIDManager & IKeyManager & IResolver & IOIDCPlugin & ICredentialPlugin
  >;

  private dbConnection: DataSource;

  private providerConfig: { networks: { name: string; rpcUrl: string }[] };

  constructor(private configService: ConfigService<IConfig, true>) {
    this.dbConnection = new DataSource({
      type: 'sqlite',
      database: 'database.oidc-demo.verifier',
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
                  this.configService.get<string>('VERIFIER_DB_SECRET')
                )
              )
            ),
          },
        }),
        // FIXME: Maybe not needed in Verifier
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
          url: this.configService.get<string>('VERIFIER_URL'),
          db_secret: this.configService.get<string>('VERIFIER_DB_SECRET'),
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

  getAgent(): TAgent<IDIDManager & IKeyManager & IResolver & IOIDCPlugin> {
    return this.agent;
  }
}
export default AgentService;
