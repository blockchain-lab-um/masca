# SSI Snap &middot; [![npm version](https://img.shields.io/npm/v/@blockchain-lab-um/ssi-snap.svg?style=flat)](https://www.npmjs.com/package/@blockchain-lab-um/ssi-snap)

The SSI Snap enables everyone to build their **decentralized and self-sovereign identity by enhancing MetaMask with functionalities to manage DIDs, VCs, and VPs.** Any dApp can connect it to access identity data, and dApp developers can already start with the integration!

[Demo](https://blockchain-lab-um.github.io/course-dapp/)
[Docs](https://blockchain-lab-um.github.io/ssi-snap-docs/)
[Blog post](https://medium.com/@blockchainlabum/open-sourcing-ssi-snap-for-metamask-aaa176775be2)

# Features

The SSI Snap is built agnostic, leaving the user to choose his preferred **blockchain, DID method, and VC storage provider.** Everything is configurable, just like selecting the network in MetaMask. Currently supported technologies:

- **Blockchains:** Ethereum
- **DID methods:** `did:ethr`, `did:key`
- **VC storage providers:** Local (MetaMask Snap state), Ceramic

Many new features are already in the works. For more information, please check the [roadmap](https://blockchain-lab-um.github.io/ssi-snap-docs/docs/roadmap) on the documentation.

# Development

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/)
  - ⚠️ You cannot have other versions of MetaMask installed
- Node.js `16`. We **strongly** recommend you install via [NVM](https://github.com/creationix/nvm) to avoid incompatibility issues between different node projects.
  - Once installed, you should also install [Yarn](http://yarnpkg.com/) with `npm i -g yarn` to make working with this repository easiest.

## Installing

## Running

### Snap

### Demo

# Feature requests

Is SSI Snap missing some crucial features? For new features and other enhancements, please open a new issue. If you are unsure if it fits in the Snap, start a new discussion under the Discussions tab.

# Licenses

This project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
