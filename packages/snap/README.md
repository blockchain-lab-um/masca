<div align="center" id="logo">
  
  ![Masca logo](../../assets/masca_logo_dark.svg#gh-dark-mode-only)
  ![Masca logo](../../assets/masca_logo_light.svg#gh-light-mode-only)
  
</div>

## [![npm version](https://img.shields.io/npm/v/@blockchain-lab-um/masca.svg?style=flat)](https://www.npmjs.com/package/@blockchain-lab-um/masca)

Masca enables everyone to build their **decentralized and self-sovereign identity by enhancing MetaMask with functionalities to manage DIDs, VCs, and VPs.** Any dApp can connect it to access identity data, and dApp developers can already start with the integration!

- [Website](https://blockchain-lab-um.github.io/masca/)
- [Demo](https://blockchain-lab-um.github.io/course-dapp/)
- [Docs](https://docs.masca.io/)
- [Blog post](https://medium.com/@blockchainlabum/open-sourcing-ssi-snap-for-metamask-aaa176775be2)

# Features

Masca is built agnostic, leaving the user to choose his preferred **blockchain, DID method, and data storage provider.** Everything is configurable, just like selecting the network in MetaMask. Currently supported technologies:

- **Blockchains:** Any EVM-based blockchain that is supported by DID methods
- **DID methods:** `did:ethr`, `did:key`, `did:pkh`, `did:jwk`
- **Data storage providers:** Local MetaMask Snap state, Ceramic Network

Many new features are already in the works. For more information, please check the [roadmap](https://blockchain-lab-um.github.io/masca-docs/docs/roadmap) on the documentation.

# Development

### Versions

Every version of Masca does NOT work with every version of MetaMask Flask! Here is a table of compatible versions:

| Masca version | MetaMask Flask version |
| ------------- | ---------------------- |
| 1.2.2         | up to 10.19.0          |
| 1.3.0         | 10.24.0                |
| 1.4.0         | 10.25.0                |
| 1.5.0         | 10.26.1                |

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/)
  - ⚠️ You cannot have other versions of MetaMask installed
- Node.js `18`. We **strongly** recommend you install via [NVM](https://github.com/creationix/nvm) to avoid incompatibility issues between different node projects.
  - Once installed, you should also install [pnpm](https://pnpm.io/) with `npm i -g pnpm` to make working with this repository easiest.

## Running

- Run `pnpm build:all`

### Snap

- To start the Snap run `pnpm start:snap`
- Snap can be tested on `localhost:8081/` or on Masca website

### Website

- To start the Website run `pnpm start:dapp`

### Docs

- To start the Website run `pnpm start:docs`

# Feature requests

Is Masca missing some crucial features? For new features and other enhancements, please open a new issue. If you are unsure if it fits in the Snap, start a new discussion under the Discussions tab.

# Rebrand

Masca was previously called SSI Snap; thus, the old name can still appear in some places. You can also find earlier versions of the Snap under the SSI Snap packages.

# Licenses

This project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)
