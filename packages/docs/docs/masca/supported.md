---
sidebar_position: 6
---

# What is Supported?

DID methods:

- [`did:ethr`](https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md)
- [`did:key`](https://w3c-ccg.github.io/did-method-key/) - including `did:key` method used for creation and management of [EBSI Natural Person identifiers](https://hub.ebsi.eu/vc-framework/did/did-methods/natural-person)
- [`did:pkh`](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md)
- [`did:jwk`](https://github.com/quartzjer/did-jwk/blob/main/spec.md)
- [`did:polygonid`](https://github.com/0xPolygonID/did-polygonid/blob/main/did-polygonid-method-draft.md)
- [`did:iden3`](https://docs.iden3.io/getting-started/identity/identifier/)

Data Storage:

- Local [MetaMask Snap](https://docs.metamask.io/guide/snaps.html) state (fully off-chain)
- [Ceramic Network](https://ceramic.network/)

Proof Formats:

- [JWT](https://www.rfc-editor.org/rfc/rfc7519)
- [EIP712](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/)
- [JSON-LD (some edge cases may not work properly)](https://w3c.github.io/vc-data-integrity/#proofs)
- [zkProofs (Polygon ID)](https://0xpolygonid.github.io/tutorials/)

Signing of data:

- `JWTs` - signed using keys from `did:key` and `did:jwk` did methods
- `JWZs` - signing (proving) messages with `did:polygon` and `did:iden3` did methods
