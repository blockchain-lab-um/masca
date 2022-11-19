---
sidebar_position: 4
---

# Architecture

Veramo client powers the SSI Snap.

![SSI Snap Architecture](https://i.imgur.com/YiAnoly.png)

<center> Figure 1: SSI Snap Architecture </center>
<br />

## Veramo Client

Veramo Client is used to manage DIDs and VCs, using Veramos **DIDManager**, **KeyManager** and **PrivateKeyManager** plugins and our custom **[VCManager plugin](../libraries/vc-manager)**.

SSI Snap uses following Veramo Client configuration:

```typescript
const agent = createAgent<
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
        snap: new KeyManagementSystem(new SnapPrivateKeyStore()),
      },
    }),
    new DIDManager({
      store: new SnapDIDStore(),
      defaultProvider: 'metamask',
      providers: didProviders,
    }),
    new VCManager({ store: vcStorePlugins }),
    new CredentialIssuer(),
    new CredentialIssuerEIP712(),
    new MessageHandler({
      messageHandlers: [
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...keyDidResolver(),
      }),
    }),
  ],
});
```

**DIDManager**, **KeyManager**, **PrivateKeyManager** and **[VCManager](../plugins/vc-manager)** plugins take care of managing and storing data. They all come with an abstract data-store class, e.g. [AbstractVCStore](https://github.com/blockchain-lab-um/veramo-vc-manager/blob/main/src/vc-store/abstract-vc-store.ts). Using said class, we implemented custom data-store plugins, that save data inside the MetaMask state or on the Ceramic Network.

These abstract classes make implementing different ways of storing data easy.

In the future, users will get to choose between different DataStore plugins (cloud, other apps, etc.).

**If you're interested in how VCs and VPs are generated and how Veramo and its plugins work visit their [documentation](https://veramo.io/docs/basics/introduction)!**
