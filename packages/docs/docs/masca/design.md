---
sidebar_position: 2
---

# Design

**Masca** is a MetaMask Snap that adds support for **SSI**: it can manage **DIDs**, store and create **VCs**, create **VPs** and other useful SSI features such as validating VCs and VPs and resolving DIDs. It is designed to be blockchain-agnostic. Masca works on existing MetaMask accounts (which are already DIDs of some methods) and their private keys to create new DIDs, without the need to create new private keys and worry about their security!

## DID Methods

When working with SSI, choosing the DID method can take a lot of work. One of the most popular methods is called **did:ethr**. This method uses Ethereum addresses as fully self-managed DIDs. In other words, every Ethereum account is a DID. An example of an Ethereum address as a DID:

```js
did: ethr: 0x9907a0cf64ec9fbf6ed8fd4971090de88222a9ac;
```

Ethereum accounts in MetaMask are already essentially DIDs. Only the needed functionality to use them and leverage their potential correctly was missing.

#### But a single DID method cannot fit all the different use cases and projects. Thus we are developing Masca in a way to support multiple DID methods and Proof Formats to give **developers** and/or **users** freedom to use whatever their usecase requires!

Masca supports already supports some other popular methods and even more are planned to get support. Supported DID methods can be divided into two categories; ones that use MetaMask address as an identifier and ones that generate identifier that has nothing to do with existing MetaMask account. The former will simply use MetaMask account address in a DID (and use `sign_typedData` to create VCs and VPs), while the latter will generate a completely new Identifier from private keys (Private keys are derived from a different coin_type and are not the same as users Accounts private keys).

Each DID method from the latter category uses a different index for deriving its private key. In other words, Every DID method uses a different private key, making them even more secure and isolated from each other.

### Accounts

You might be asking yourselves how exactly does this work with existing MetaMask accounts. The answer is simple, it works just like you'd expect it to. Every single account in MetaMasks also represents an account in Masca and you can generate as many new accounts as you wish.

This essentialy means you can generate as many DIDs as you wish by creating new Accounts in MetaMask and switching to them. This in combination with each Account supporting multiple DID methods (previous section) gives users ultimate freedom with DIDs.

To paint a better picture, a user can create as many Accounts as they need and each account can use many DID methods. They can create a primary account where they want to create VPs with their Ethereum address, using `did:ethr` method. They can also create a secondary Account they use for gaming where they can use `did:key` for platform A and `did:jwk` for platform B. Should they need to use `did:ethr` but does not want to use address where all of their assets are they can simply create a new Account in MetaMask and use it. Do they want to use newest account, but with a different method? They can!

Every single DID from this example uses a different private key and in case one gets compromised, the rest stays safe!

### Private Keys

As previously mentioned, only some DIDs actually need to use private keys.

Private keys are derived from a seed phrase in MetaMask (Imported accounts are not supported for the moment) using a custom [coin_type `1236`](https://github.com/satoshilabs/slips/blob/master/slip-0044.md#registered-coin-types). MetaMask Snaps do NOT have access to private keys derived from coin_type `60`, which means Masca or any other snap have NO access to Ethereums (or any other supported in MetaMask) private keys. This also means users do not need to backup their (DIDs) private keys, only their seed phrase.

Methods that do not require private keys (did:ethr & did:pkh) use `sign_typedData` to create VCs and VPs. This however is not supported in Snaps, meaning this has to be done in a dApp. We support this in our Connector library, but in case a dApp does not want to use Connector library, they have to handle VC/VP creation themselves.

More on how private keys are handled in Masca later.

### Switching between different DID methods

In Masca, users can pick a different DID method for every MetaMask account. For example, if they want to use `did:ethr` on Account 1 and `did:key` on Account 2, they can! This of course does not limit one account to one did method. Like mentioned previously each account can use every supported method and switch between them on the go!

For the complete list of supported DID methods, check [this page](./supported).

## Verifiable Data

There are two types of Verifiable Data in the SSI trust model and lifecycle; **Verifiable Credentials** and **Verifiable Presentations**.

### Verifiable Credentials (VCs)

Masca supports storing VCs in its local storage or on different supported networks. It also enables storing some data locally, such as personal passports and driving licenses, while other less critical data, like conference certificates or course applications, can be stored on public networks. Best of all, users can decide where their data should end up!

For more information on the storage, check [this page](./storage).

Masca also supports creating VCs that can be issued by any DID in the wallet! Aside from issuing and storing VCs Masca also allows user to verify validity of a VC.

### Verifiable Presentations (VPs)

On the other hand, VPs are signed by holders using their wallets (which is Masca). Usually, they are signed on the go when requested by different applications. Masca supports creating VP from single or multiple VCs.

Verifying validity of VPs is also supported

### Signing Credentials (Handling private keys)

During the runtime of each RPC method, private keys are retrieved (and derived) from MetaMask using the Snap RPC method `snap_getBip44Entropy`. After the RPC method is finished, private keys are cleared from the memory and are never stored anywhere.

## Cryptography

Cryptography is what makes everything secure and possible. VCs and VPs are both digitally signed and verifiable by everyone that gets in contact with them.

### Cryptographic keys

Ethereum relies on the elliptic curve `secp256k1`; thus, this is the only key type available in the MetaMask. Using the derivation schemes presented in the different [BIP standards](https://github.com/bitcoin/bips), it is possible to generate multiple key pairs (and associated accounts) from a single seed phrase. Backing up the seed phrase automatically backup all keys since they can always be derived deterministically, which solves the problem of other SSI wallets that generate new keys each time from scratch and not in relation to the previous keys.

But because of the limitation of the specific key type, we currently can only support all DID methods that work on `secp256k1` keys. There is a way to create key pair of any type (e.g., Ed25519) in the Snap (since you can write any custom JavaScript), but storing and securely handling these keys gets complicated. But because the elliptic curve `secp256k1` is widely used, most DID methods support it.

We are also looking into pairing-friendly elliptic curves, which enable advanced ways to perform selective disclosure and zero-knowledge proofs, e.g., `BLS12-381`, where it would make sense to implement custom and complex security storage for keys generated inside Snap.

### Proof formats

There are different ways to digitally sign and represent digital signatures alongside the data or payload (VC or VP). In the SSI and web3 world, currently, three approaches are most adopted: **JWT**, **Linked Data Proofs**, and **EIP712**. Masca supports all three types.

For the complete list of supported proof formats, check [this page](./supported).

## Data Storage

As stated above, DIDs and VCs need to be stored somewhere. We plan to support many different data storage providers to fulfill all users' needs. While keeping data locally in the MetaMask state is the most private way to store the data (it is also encrypted), other solutions bring many benefits, such as the ability to sync between different devices and easier ways to make external backups.

For the complete list of supported data storage providers, check [this page](./supported).

## Decentralized Identity Framework

Using a framework is the best way to handle DIDs and VCs in the code. Masca uses **[Veramo](https://veramo.io/)** for that purpose. Veramo is a performant and modular API for Verifiable Data and Decentralized Identity/SSI. It's a library that allows the creation and management of DIDs, VCs, and VPs and makes developers' lives working with them much easier. We highly encourage you to check their website!
