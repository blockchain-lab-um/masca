---
sidebar_position: 2
---

# Design

**Masca** is a MetaMask Snap that adds support for **SSI**: it can manage **DIDs**, store and create **VCs**, create **VPs**, and other useful SSI features such as validating VCs and VPs and resolving DIDs. It is designed to be blockchain-agnostic. Masca works on existing MetaMask accounts (which are already DIDs of some methods) and their private keys to create new DIDs, without the need to create new private keys and worry about their security!

## DID Methods

Choosing the DID method can take much work when working with SSI. One of the most popular methods is **did:ethr**. This method uses Ethereum addresses as fully self-managed DIDs. In other words, every Ethereum account is a DID. An example of an Ethereum address as a DID:

```js
did: ethr: 0x9907a0cf64ec9fbf6ed8fd4971090de88222a9ac;
```

Ethereum accounts in MetaMask are already essentially DIDs. Only the needed functionality to use them and leverage their potential correctly was missing.

#### But a single DID method cannot fit all the different use cases and projects. Thus we are developing Masca to support multiple DID methods and Proof Formats to give **developers** and **users** the freedom to use whatever their use case requires!

Masca already supports some other popular methods, and we plan to add support for even more. Supported DID methods can be divided into two categories; ones that use the MetaMask address as an identifier and those that generate an identifier unrelated to the existing MetaMask account. The former will use a MetaMask account address in a DID (and use the `sign_typedData` RPC method to sign VCs and VPs). At the same time, the latter will generate a completely new Identifier from private keys. We derive those private keys from a different `coin_type` 1236 (you can find it in the table [here](https://github.com/satoshilabs/slips/blob/master/slip-0044.md#registered-coin-types)).

Each DID method from the latter category uses a different index for deriving its private key. In other words, Every DID method uses a different private key, making them even more secure and isolated.

### Accounts

You might be asking yourself how exactly this works with existing MetaMask accounts. Every single account in MetaMask also represents an account in Masca capable of handling multiple DIDs.

You can generate as many DIDs as you wish by creating new Accounts in MetaMask and switching to them. This, combined with each Account supporting multiple DID methods (previous section), gives users the ultimate freedom with DIDs.

To paint a better picture, a user can create as many Accounts as needed, and each account can use many DID methods. They can create a primary account where they want to create VPs with their Ethereum address using the `did:ethr` method. They can also create a secondary Account for gaming where they can use `did:key` for platform A and `did:jwk` for platform B. Should they need to use `did:ethr` but do not want to use the address where all of their assets are, they can simply create and use a new Account in MetaMask.

Every Decentralized Identifier is associated with a unique private key. Consequently, only the compromised key is affected in a security breach while the others remain secure.

### Private Keys

As previously mentioned, only some DIDs need to use private keys.

Private keys are derived from a seed phrase in MetaMask (Imported accounts are currently not supported) using a custom [ `coin_type` 1236](https://github.com/satoshilabs/slips/blob/master/slip-0044.md#registered-coin-types). MetaMask Snaps do NOT have access to private keys derived from `coin_type` 60, which means Masca or any other snap has NO access to Ethereum private keys (or any other MetaMask-supported keys). While giving the users peace of mind that their private keys are safe, this also means that they do not need to backup their private keys used for DIDs, only their seed phrase.

Methods that do not require private keys ( `did:ethr` & `did:pkh` ) use `sign_typedData` to create VCs and VPs. Snaps do not support this, meaning the signing for these methods must be done in a dApp. However, when using our [Masca Connector SDK](https://www.npmjs.com/package/@blockchain-lab-um/masca-connector), this is taken care of, and any RPC method requiring the signature is handled accordingly without needing external handling.

### Handling and deriving private keys used in Masca

Securely handling private keys in Masca is our topmost priority. Therefore, we never get/derive/use the user's Ethereum private keys. For methods requiring Ethereum keys, we use [ `eth_signTypedData_v4` ](https://docs.metamask.io/wallet/how-to/sign-data/#use-eth_signtypeddata_v4) for signatures, handled inside [Masca Connector](/libraries/masca-connector.md).

For other methods, we derive private keys from a different `coin_type` 1236. How is this done in detail? The steps are as follows:

1. Using the snap's [`snap_getEntropy` RPC method](https://docs.metamask.io/snaps/reference/rpc-api/#snap_getentropy) we deterministically get the unique and random entropy for the current account (passing the current account as a salt parameter - see `snap_getEntropy` reference).

```typescript
const entropy = await snap.request({
  method: 'snap_getEntropy',
  params: {
    version: 1,
    salt: state.currentAccount,
  },
});
```

2. We then use the received 256-bit (32 bytes) entropy to create a new wallet using [`ethers`](https://www.npmjs.com/package/ethers) library. See the `nodeWallet` variable below.

```typescript
const methodIndexMapping: Record<InternalSigMethods, number> = {
  'did:key': 0,
  'did:key:jwk_jcs-pub': 0,
  'did:jwk': 1,
  'did:iden3': 2,
  'did:polygonid': 3,
} as const;

const nodeWallet = HDNodeWallet.fromMnemonic(
  Mnemonic.fromEntropy(entropy)
).derivePath(`m/44/1236/${methodIndexMapping[method]}/0/0`);
```

`Mnemonic.fromEntropy()` generates a seed phrase from the passed entropy, which we then use to create a new wallet.

:::tip Method index mapping

As you can see, we use different indices for different did methods. We then pass the index (see `methodIndexMapping[method]` ) into the derivation path as the `account` part of the path. More on this can be found in [ `BIP-44` ](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels).

:::

3. Using the created `nodeWallet`, the private keys are always derived deterministically, meaning the same seed phrase always produces the same keys, ensuring the same created identifiers always stay with you when importing a wallet from a seed phrase.

4. The private keys are deleted from MetaMask's snap state whenever the RPC method finishes execution, and the snap's lifecycle ends. See [Snaps lifecycle](https://docs.metamask.io/snaps/concepts/lifecycle/) for more info.

### Switching between different DID methods

In Masca, users can pick a different DID method for every MetaMask account. For example, if they want to use `did:ethr` on Account 1 and `did:key` on Account 2, they can! This does not limit one account to one DID method. As described previously, each account can use every supported DID method and switch between them on the fly!

To find out which methods we currently support, jump to [What is Supported?](./supported).

## Verifiable Data

There are two types of Verifiable Data in the SSI trust model and lifecycle; **Verifiable Credentials** and **Verifiable Presentations**.

### Verifiable Credentials (VCs)

Masca supports storing VCs in its local storage or on different supported networks. It also enables storing some data locally, such as personal passports and driving licenses. In contrast, other less critical data, like conference certificates or course applications, can be stored on public networks. Best of all, users can decide where their data should end up!

For more information on the storage, check [this page](./storage).

Masca also supports creating VCs that any DID can issue in the wallet! Aside from issuing and storing VCs, Masca also allows users to verify a VC's validity.

### Verifiable Presentations (VPs)

On the other hand, VPs are signed by holders using their wallets (which is Masca). Usually, they are signed on the go when requested by different applications. Masca supports creating VPs from single or multiple VCs. Validating VPs is also supported.

### Signing Credentials

During the runtime of each RPC method, private keys are retrieved (and derived) from MetaMask using the Snap RPC method `snap_getBip44Entropy` .

:::tip Don't worry, your private keys are safe!

**After the RPC method finishes execution, private keys are cleared from the memory and are never stored anywhere.**

:::

## Cryptography

Cryptography is what makes everything secure and possible. VCs and VPs are both digitally signed and verifiable by everyone that gets in contact with them.

### Cryptographic keys

Ethereum relies on the elliptic curve `secp256k1` ; thus, this is the only key type available in the MetaMask. Conforming to the derivation schemes presented in the different [BIP standards](https://github.com/bitcoin/bips), generating multiple key pairs (and associated accounts) from a single seed phrase is possible. Backing up the seed phrase consequently backs up all the keys used in Masca since they can always be derived deterministically.

But because of the limitation of the specific key type, we currently support all DID methods that work with `secp256k1` keys. There is a way to create key pair of any type (e.g., `Ed25519` ) in the Snap (since you can write any custom JavaScript), but storing and securely handling these keys gets complicated. Fortunately, the elliptic curve `secp256k1` is widely used and popular with most DID methods.

We are also looking into pairing-friendly elliptic curves, which enable advanced ways to perform selective disclosure and zero-knowledge proofs, e.g., `BLS12-381` and `BabyJubJub` , where it would make sense to implement custom and complex security storage for keys generated inside Snap.

### Proof formats

Different ways exist to digitally sign and represent digital signatures alongside the data or payload (VC or VP). In the SSI and web3 world, currently, three approaches are most adopted: **JWT**, **Linked Data Proofs**, and **EIP712**. Masca supports all three types.

For the complete list of supported proof formats, check [What is Supported?](./supported).

## Data Storage

As stated above, DIDs and VCs need to be stored somewhere. We plan to support many data storage providers to fulfill all users' needs. While keeping data locally in the MetaMask state is the most private way to store the data (it is also encrypted), other solutions bring many benefits, such as the ability to sync between different devices and easier ways to make external backups.

For the complete list of supported data storage providers, check [this page](./supported).

## Decentralized Identity Framework

A framework designed specifically for managing Decentralized Identities is best for handling DIDs and VCs when developing such software as Masca. That's why we take on the advantages of **[Veramo](https://veramo.io/)** for that purpose. Veramo is a performant and modular API for Verifiable Data and Decentralized Identity/SSI. It's a library that allows the creation and management of DIDs, VCs, and VPs and makes developers' lives working with them much ... simpler. We highly encourage you to check their website!
