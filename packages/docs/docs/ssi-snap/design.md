---
sidebar_position: 2
---

# Design

**The SSI Snap is a MetaMask Snap, that can handle DIDs, securely store VCs, and create the VPs. It is designed to be blockchain-agnostic. SSI Snap uses existing MetaMask accounts as DIDs or as a mean to create new DIDs, without the need to ever export private keys from MetaMask, hence leveraging its security!
**

## DID Method

When working with DIDs, there are various DID methods to choose from. One of the most popular methods is called **did:ethr**. This method uses Ethereum addresses as fully self-managed DIDs. In other words, every Ethereum account is a DID. An example of Ethereum address as a DID;

```js
did: ethr: 0x9907a0cf64ec9fbf6ed8fd4971090de88222a9ac;
```

Ethereum accounts in MetaMask, used daily by millions, are essentially DIDs. What is missing is the functionality to use them and leverage their potential correctly.

You might ask yourselves why we have decided to build a proof of concept on Ethereum. There are a couple of reasons:

- Aside from Bitcoin, it's the most decentralized blockchain,
- It's the most popular and most commonly used blockchain,
- Huge developer community with plenty of already established frameworks, including various SSI & DID frameworks and battle-tested did:ethr method,
- DID Documents do not need to be changed often (or even never in some cases); hence gas fees do not present such a huge problem

### Available DID Methods (Experimental)

In SSI Snap, users can pick a different DID method for every account they use. For example if they want to use `did:ethr` on Account 1 and `did:key` on Account 2, they can!

Currently, SSI Snap supports 2 DID methods; `did:ethr` and `did:key`. In the future we plan to add support for other significant DID methods that are capable of expressing secp256k keys.

:::danger

DID:KEY support is experimental and still under development!

:::

## Digital Signatures

Digital signatures apply to both VCs and VPs, but in most cases, they are signed by different actors in the SSI lifecycle. Thus we can approach them in a slightly different way.

### Verifiable Credentials (VCs)

SSI Snap supports storing of VCs. They can contain different proof types, such as JSON-LD and JWT. There are also no limitations to signature algorithms since VCs are often signed on the backend systems of the issuers, where any software library can be used. Several algorithms and cryptographic primitives are supported, such as secp256k and Ed25519.

### Verifiable Presentations (VPs)

On the other hand, VPs are signed by holders using their wallets, which is the role of SSI Snap. MetaMask cryptographic and signing capabilities are used for digitally signing VPs; thus, digital signatures are limited to cryptographic primitives and formats supported in the Ethereum ecosystem. Therefore VPs contain signatures in type [Ethereum EIP712 Signature 2021](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/).

## SSI Framework

To make DIDs functional a framework is needed. SSI Snap uses **[Veramo framework](https://veramo.io/)** inside the SSI Snap to handle most work related to DIDs, VCs, and VPs. Veramo is a performant and modular API for Verifiable Data and SSI. Essentially it's a client that allows the creation and management of DIDs, VCs, and VPs and makes developers' lives working with them much easier.

## Data Storage

These DIDs and VCs need to be stored somewhere. By default, SSI Snap stores all data in the MetaMask State, but it is possible to store VCs on [Ceramic Network](https://ceramic.network/). More about this in the [State](/docs/ssi-snap/storage) section.

In the future other ways of storing data will be implemented, starting with storing data in the cloud. Storing data outside MetaMask brings many benefits such as ability to sync multiple applications and ability to make external backups.

### Available plugins for storing VCs (Experimental)

In SSI Snap, users can decide where VCs will get stored for every account they use. For example if they want to store sensitive VCs in most private store, snap state, they can! On the other hand, if they want to store VCs on-chain and maybe sync them with their other wallets, they can do that aswell with Ceramic Network on Account 2.

Currently, SSI Snap supports 2 ways of storing VCs; `MetaMask state` and `Ceramic Network`. In the future we plan to add support for other plugins such as Google Drive, IPFS, etc.

:::danger

Ceramic network support is experimental and still under development!

:::

## Security

To maintain as much security as possible, private keys from existing MetaMask accounts are never exposed to SSI Snap. EIP712 Signature is used to sign credentials.

Additionally, all MetaMask state is encrypted!
