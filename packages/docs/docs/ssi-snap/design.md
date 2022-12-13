---
sidebar_position: 2
---

# Design

**SSI Snap** is a MetaMask Snap that adds support for **SSI**: it can manage **DIDs**, store **VCs**, and create the **VPs**. It is designed to be blockchain-agnostic. SSI Snap works on existing MetaMask accounts (which are already DIDs of some methods) and their private keys to create new DIDs, without the need to create new private keys and worry about their security!

## DID Methods

When working with SSI, choosing the DID method can take a lot of work. One of the most popular methods is called **did:ethr**. This method uses Ethereum addresses as fully self-managed DIDs. In other words, every Ethereum account is a DID. An example of an Ethereum address as a DID:

```js
did: ethr: 0x9907a0cf64ec9fbf6ed8fd4971090de88222a9ac;
```

Ethereum accounts in MetaMask are already essentially DIDs. Only the needed functionality to use them and leverage their potential correctly was missing.

Now you might ask yourselves why we have decided to build a proof of concept on Ethereum in the first place. There were a couple of reasons:

- Besides Bitcoin, it's the most decentralized blockchain.
- It's the most popular and most commonly used blockchain for practical applications.
- Huge developer community with many already established frameworks, including various SSI & DID frameworks and battle-tested `did:ethr` method.
- DID Documents don't have to be changed often (or even never in some cases); hence gas fees do not present such a huge problem.

But a single DID method cannot fit all the different use cases and projects. Thus we are developing SSI Snap in a way that the user can change the DID method that she is currently using (similar to selecting a network in MetaMask), or dApp/app can enforce the usage of a specific DID method if its functionalities depend on it.

### Switching between different DID methods

In SSI Snap, users can pick a different DID method for every MetaMask account. For example, if they want to use `did:ethr` on Account 1 and `did:key` on Account 2, they can!

For the complete list of supported DID methods, check [this page](./supported).

## Verifiable Data

There are two types of Verifiable Data in the SSI trust model and lifecycle; **Verifiable Credentials** and **Verifiable Presentations**.

### Verifiable Credentials (VCs)

SSI Snap supports storing VCs in its local storage or on different supported networks. It also enables storing some data locally, such as personal passports and driving licenses, while other less critical data, like conference certificates or course applications, can be stored on public networks. Best of all, users can decide where their data should end up!

For more information on the storage, check [this page](./storage).

### Verifiable Presentations (VPs)

On the other hand, VPs are signed by holders using their wallets (which is SSI Snap). Usually, they are signed on the go when requested by different applications. SSI Snap supports creating VP from single or multiple VCs.

### Signing Credentials

[**JWT**](https://www.rfc-editor.org/rfc/rfc7519) is one of the most popular proof formats for VCs. To support this proof type, we changed how SSI Snap retrieves private keys from MetaMask. From now on, we are using the Snap RPC method [`snap_getBip44Entropy`](https://docs.metamask.io/guide/snaps-rpc-api.html#restricted-methods), which is also the preferred way for all Snaps (see discussion: https://github.com/MetaMask/SIPs/discussions/64#discussioncomment-3963830).

During the runtime of each RPC method, private keys are retrieved (and derived) from MetaMask using the Snap RPC method `snap_getBip44Entropy`. After the RPC method is finished, private keys are cleared from the memory and are never stored anywhere. For now, we are using only keys derived for the Ethereum network, but in the future, this same Snap method will help us with keys for other blockchain networks.

Handling private keys in this way brings several other benefits:

- Way fewer popups when performing different operations, which results in a much better UX,
- No more red "danger" pop when singing VPs and using deprecated MetaMask signing RPC method,
- Ability to create different proof formats - JWT, Linked Data Proofs, and EIP712,
- Ability to implement more functionalities of DID methods on other blockchain networks (such as Cosmos), and
- Derive private keys for other networks/coins by using different coin type values ([SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)).

Our code is completely open-sourced and we encourage users to take a look at our code!
## Cryptography

Cryptography is what makes everything secure and possible. VCs and VPs are both digitally signed and verifiable by everyone that gets in contact with them. Because of developing on web3/Ethereum snap, we are reusing your existing cryptography keys, so the users do not have to worry about backing up the additional keys.

### Cryptographic keys

Ethereum relies on the elliptic curve `secp256k1`; thus, this is the only key type available in the MetaMask. Using the derivation schemes presented in the different [BIP standards](https://github.com/bitcoin/bips), it is possible to generate multiple key pairs (and associated accounts) from a single seed phrase. Backing up the seed phrase automatically backup all keys since they can always be derived deterministically, which solves the problem of other SSI wallets that generate new keys each time from scratch and not in relation to the previous keys.

But because of the limitation of the specific key type, we currently can only support all DID methods that work on `secp256k1` keys. There is a way to create key pair of any type (e.g., Ed25519) in the Snap (since you can write any custom JavaScript), but storing and securely handling these keys gets complicated. But because the elliptic curve `secp256k1` is widely used, most DID methods support it.

We are also looking into pairing-friendly elliptic curves, which enable advanced ways to perform selective disclosure and zero-knowledge proofs, e.g., `BLS12-381`, where it would make sense to implement custom and complex security storage for keys generated inside Snap.

### Proof formats

There are different ways to digitally sign and represent digital signatures alongside the data or payload (VC or VP). In the SSI and web3 world, currently, three approaches are most adopted: **JWT**, **Linked Data Proofs**, and **EIP712**. SSI Snap supports all three types.

For the complete list of supported proof formats, check [this page](./supported).

## Data Storage

As stated above, DIDs and VCs need to be stored somewhere. We plan to support many different data storage providers to fulfill all users' needs. While keeping data locally in the MetaMask state is the most private way to store the data (it is also encrypted), other solutions bring many benefits, such as the ability to sync between different devices and easier ways to make external backups.

For the complete list of supported data storage providers, check [this page](./supported).

## Decentralized Identity Framework

Using a framework is the best way to handle DIDs and VCs in the code. SSI Snap uses **[Veramo](https://veramo.io/)** for that purpose. Veramo is a performant and modular API for Verifiable Data and Decentralized Identity/SSI. It's a library that allows the creation and management of DIDs, VCs, and VPs and makes developers' lives working with them much easier. We highly encourage you to check their website!
