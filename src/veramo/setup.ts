// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
} from "@veramo/core";

// // Core identity manager plugin
import { DIDManager } from "@veramo/did-manager";

// // Ethr did identity provider
import { EthrDIDProvider } from "@veramo/did-provider-ethr";

// // Web did identity provider
import { WebDIDProvider } from "@veramo/did-provider-web";

// // Core key manager plugin
import { KeyManager } from "@veramo/key-manager";

// // Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";

// // Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";

// // Storage plugin using TypeOrm
import {
  Entities,
  KeyStore,
  DIDStore,
  IDataStoreORM,
  PrivateKeyStore,
  migrations,
} from "@veramo/data-store";

import { MemoryKeyStore, MemoryPrivateKeyStore } from "@veramo/key-manager";

import { MemoryDIDStore } from "@veramo/did-manager";

// // TypeORM is installed with `@veramo/data-store`
// import { createConnection } from "typeorm";

// This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = "database.sqlite";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = "6e751a2e5ff741e5a01eab15e4e4a88b";

// This will be the secret key for the KMS
const KMS_SECRET_KEY = "6e751a2e5ff741e5a01eab15e4e4a88baaaa";

export const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver
>({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
      },
    }),
    new DIDManager({
      store: new MemoryDIDStore(),
      defaultProvider: "did:ethr:rinkeby",
      providers: {
        "did:ethr:rinkeby": new EthrDIDProvider({
          defaultKms: "local",
          network: "rinkeby",
          rpcUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
        }),
        "did:web": new WebDIDProvider({
          defaultKms: "local",
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
  ],
});

// export const agent = "lolek";
