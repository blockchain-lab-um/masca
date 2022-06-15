// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
  MinimalImportableKey,
} from "@veramo/core";

import { AbstractIdentifierProvider, DIDManager } from "@veramo/did-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { KeyManager } from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { VCManager, IVCManager } from "@blockchain-lab-um/veramo-vc-manager";
import { Web3Provider } from "@ethersproject/providers";
import { Web3KeyManagementSystem } from "@veramo/kms-web3";
import {
  CredentialIssuerEIP712,
  ICredentialIssuerEIP712,
} from "@veramo/credential-eip712";
import { SdrMessageHandler } from "@veramo/selective-disclosure";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { MessageHandler } from "@veramo/message-handler";
import {
  SnapDIDStore,
  SnapKeyStore,
  SnapVCStore,
  SnapPrivateKeyStore,
} from "./plugins/snapDataStore/snapDataStore";

import {
  CredentialIssuer,
  ICredentialIssuer,
  W3cMessageHandler,
} from "@veramo/credential-w3c";
import { getCurrentAccount } from "../utils/snap_utils";

const INFURA_PROJECT_ID = "6e751a2e5ff741e5a01eab15e4e4a88b";

declare let wallet: any;

const web3Providers: Record<string, Web3Provider> = {};
const didProviders: Record<string, AbstractIdentifierProvider> = {};

web3Providers["metamask"] = new Web3Provider(wallet);
didProviders["metamask"] = new EthrDIDProvider({
  defaultKms: "web3",
  network: "rinkeby",
  web3Provider: new Web3Provider(wallet),
  rpcUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
});

export const agent = createAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IVCManager &
    ICredentialIssuerEIP712 &
    ICredentialIssuer
>({
  plugins: [
    new KeyManager({
      store: new SnapKeyStore(),
      kms: {
        web3: new Web3KeyManagementSystem(web3Providers),
        //local: new KeyManagementSystem(new SnapPrivateKeyStore()),
      },
    }),
    new DIDManager({
      store: new SnapDIDStore(),
      defaultProvider: "metamask",
      // providers: {
      //   "did:ethr:rinkeby": new EthrDIDProvider({
      //     defaultKms: "web3",
      //     network: "rinkeby",
      //     web3Provider: new Web3Provider(wallet),
      //     //rpcUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
      //   }),
      // },
      providers: didProviders,
    }),
    new VCManager({ store: new SnapVCStore() }),
    new CredentialIssuer(),
    new CredentialIssuerEIP712(),
    // new MessageHandler({
    //   messageHandlers: [
    //     new JwtMessageHandler(),
    //     new W3cMessageHandler(),
    //     new SdrMessageHandler(),
    //   ],
    // }),
    // new DIDResolverPlugin({
    //   resolver: new Resolver({
    //     ethr: ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }).ethr,
    //   }),
    // }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
      }),
    }),
  ],
});

export const fillDids = async () => {
  const account = await getCurrentAccount();
  let did = "did:ethr:0x4:" + account;
  const controllerKeyId = `metamask-${account}`;
  await agent.didManagerImport({
    did,
    provider: "metamask",
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: "Secp256k1",
        kms: "web3",
        privateKeyHex: "",
        meta: {
          provider: "metamask",
          account: account.toLocaleLowerCase(),
          algorithms: ["eth_signMessage", "eth_signTypedData"],
        },
      } as MinimalImportableKey,
    ],
  });
};
