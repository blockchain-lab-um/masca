import { IOIDCRPPlugin, OIDCRPPlugin } from '@blockchain-lab-um/oidc-rp-plugin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
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
  migrations,
  PrivateKeyStore,
} from '@veramo/data-store';
import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { DataSource } from 'typeorm';

import { IConfig } from '../../config/configuration.js';

@Injectable()
export class AgentService {
  private agent: TAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      IOIDCRPPlugin &
      ICredentialPlugin &
      ICredentialIssuerEIP712 &
      ICredentialIssuerLD
  >;

  private dbConnection: DataSource;

  private providerConfig: { networks: { name: string; rpcUrl: string }[] };

  constructor(private configService: ConfigService<IConfig, true>) {
    this.dbConnection = new DataSource({
      type: 'better-sqlite3',
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
        new OIDCRPPlugin({
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
  }

  getAgent(): TAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      IOIDCRPPlugin &
      ICredentialPlugin &
      ICredentialIssuerEIP712 &
      ICredentialIssuerLD
  > {
    return this.agent;
  }
}
export default AgentService;
