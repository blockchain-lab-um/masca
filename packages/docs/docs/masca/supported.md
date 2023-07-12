---
sidebar_position: 6
---

# What is Supported?

DID methods:

- [`did:ethr`](https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md)
- [`did:key`](https://w3c-ccg.github.io/did-method-key/) - including `did:key` method used for creation and management of [EBSI Natural Person identifiers](https://api-pilot.ebsi.eu/docs/specs/did-methods/did-method-for-natural-person)
- [`did:pkh`](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md)
- [`did:jwk`](https://github.com/quartzjer/did-jwk/blob/main/spec.md)

Data Storage:

- Local [MetaMask Snap](https://docs.metamask.io/guide/snaps.html) state (fully off-chain)
- [Ceramic Network](https://ceramic.network/)

:::danger BE CAREFUL!

Ceramic Network support is experimental and still under active development!

:::

Proof Formats:

- [JWT](https://www.rfc-editor.org/rfc/rfc7519)
- [EIP712](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/)
- [JSON-LD (Currently buggy)](https://w3c.github.io/vc-data-integrity/#proofs)
