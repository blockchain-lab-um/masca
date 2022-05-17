// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
} from "@veramo/core";

import { DIDManager } from "@veramo/did-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { KeyManager } from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { VCManager, IVCManager } from "@blockchain-lab-um/veramo-vc-manager";

import {
  SnapDIDStore,
  SnapKeyStore,
  SnapVCStore,
  SnapPrivateKeyStore,
} from "./plugins/snapDataStore/snapDataStore";

import { CredentialIssuer, ICredentialIssuer } from "@veramo/credential-w3c";

const INFURA_PROJECT_ID = "6e751a2e5ff741e5a01eab15e4e4a88b";

export const agent = createAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IVCManager &
    ICredentialIssuer
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
      },
    }),
    new VCManager({ store: new SnapVCStore() }),
    new CredentialIssuer(),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
      }),
    }),
  ],
});
