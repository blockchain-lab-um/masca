// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
  IMessageHandler,
} from "@veramo/core";

// Core identity manager plugin
import { DIDManager } from "@veramo/did-manager";

// Ethr did identity provider
import { EthrDIDProvider } from "@veramo/did-provider-ethr";

// Web did identity provider
import { WebDIDProvider } from "@veramo/did-provider-web";

// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";

// Custom key management system for RN
import { KeyManagementSystem } from "@veramo/kms-local";

// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";

import { VCManager, IVCManager } from "vc-manager";

import {
  SnapDIDStore,
  SnapKeyStore,
  SnapVCStore,
  SnapPrivateKeyStore,
} from "./snapDataStore";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = "6e751a2e5ff741e5a01eab15e4e4a88b";

export const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IResolver & IVCManager
>({
  plugins: [
    new KeyManager({
      store: new SnapKeyStore(),
      kms: {
        local: new KeyManagementSystem(new SnapPrivateKeyStore()),
      },
    }),
    new DIDManager({
      store: new SnapDIDStore(),
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
    new VCManager({ store: new SnapVCStore() }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
  ],
});
