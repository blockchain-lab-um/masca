# SSI Snap &middot; [![npm version](https://img.shields.io/npm/v/@blockchain-lab-um/ssi-snap.svg?style=flat)](https://www.npmjs.com/package/@blockchain-lab-um/ssi-snap)

The SSI Snap enables everyone to build their **decentralized and self-sovereign identity by enhancing MetaMask with functionalities to manage DIDs, VCs, and VPs.** Any dApp can connect it to access identity data, and dApp developers can already start with the integration!

- [Website](https://blockchain-lab-um.github.io/ssi-snap/)
- [Demo](https://blockchain-lab-um.github.io/course-dapp/)
- [Docs](https://blockchain-lab-um.github.io/ssi-snap-docs/)
- [Blog post](https://medium.com/@blockchainlabum/open-sourcing-ssi-snap-for-metamask-aaa176775be2)

# Features

The SSI Snap is built agnostic, leaving the user to choose his preferred **blockchain, DID method, and data storage provider.** Everything is configurable, just like selecting the network in MetaMask. Currently supported technologies:

- **Blockchains:** Any EVM-based blockchain that is supported by DID methods
- **DID methods:** `did:ethr`, `did:key`
- **Data storage providers:** Local (MetaMask Snap state), Ceramic

Many new features are already in the works. For more information, please check the [roadmap](https://blockchain-lab-um.github.io/ssi-snap-docs/docs/roadmap) on the documentation.

# Development

### Versions

Every version of SSI Snap does NOT work with every version of MetaMask Flask! Here is a table of compatible versions:

| SSI Snap Version | Flask Version |
| ---------------- | ------------- |
| 1.2.2            | up to 10.19.0 |
| 1.3.0            | 10.25.0       |
| 1.4.0            | 10.27.1       |

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/)
  - ⚠️ You cannot have other versions of MetaMask installed
- Node.js `18`. We **strongly** recommend you install via [NVM](https://github.com/creationix/nvm) to avoid incompatibility issues between different node projects.
  - Once installed, you should also install [pnpm](https://pnpm.io/) with `npm i -g pnpm` to make working with this repository easiest.

## Running

- Run `pnpm build:all`

### Snap

- To start the Snap run `pnpm start:snap`
- Snap can be tested on `localhost:8081/` or on SSI Snap Website

### Website

- To start the Website run `pnpm start:dapp`

### Docs

- To start the Website run `pnpm start:docs`

# Feature requests

Is SSI Snap missing some crucial features? For new features and other enhancements, please open a new issue. If you are unsure if it fits in the Snap, start a new discussion under the Discussions tab.

# Licenses

This project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
