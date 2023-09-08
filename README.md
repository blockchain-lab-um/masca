<div align="center" id="logo">
  
  ![Masca logo](assets/svg/logo_text_white_shadow.svg#gh-dark-mode-only)
  ![Masca logo](assets/svg/logo_text_black_shadow.svg#gh-light-mode-only)
  
</div>

<h6 align="center">
  <a href="https://masca.io">Website</a>
  ·
  <a href="https://blockchain-lab-um.github.io/course-dapp/">Get your first VC</a>
  ·
  <a href="https://docs.masca.io/">Docs</a>
  ·
  <a href="https://medium.com/@blockchainlabum/open-sourcing-ssi-snap-for-metamask-aaa176775be2">Blog</a>
</h6>

<p align="center">
	<a href="https://github.com/blockchain-lab-um/masca/stargazers">
		<img alt="Stargazers" src="https://img.shields.io/github/stars/blockchain-lab-um/masca?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NDAiIGhlaWdodD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDY0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggc3R5bGU9InN0cm9rZTojNWZiYjBjO3N0cm9rZS13aWR0aDowO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7ZmlsbDojZmZkMzU5O2ZpbGwtcnVsZTpub256ZXJvO29wYWNpdHk6MSIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMDA0IDE1LjY2Nikgc2NhbGUoMTUuOTgyMjMpIiBkPSJtMjAuMDIyIDAgNS45NCAxMi44NzcgMTQuMDgyIDEuNjctMTAuNDExIDkuNjI4IDIuNzY0IDEzLjkxLTEyLjM3NS02LjkyNy0xMi4zNzQgNi45MjcgMi43NjQtMTMuOTFMMCAxNC41NDdsMTQuMDgzLTEuNjd6Ii8+PC9zdmc+&color=FFE7A6&labelColor=302D41"></a>
	<a href="https://npmjs.com/package/@blockchain-lab-um/masca">
		<img alt="NPM Release" src="https://img.shields.io/npm/v/@blockchain-lab-um/masca.svg?style=for-the-badge&logo=npm&color=FA4B4B&logoColor=AE0000&labelColor=302D41"/></a>
	<a href="https://discord.gg/M5xgNz7TTF">
		<img alt="Discord" src="https://img.shields.io/discord/1001401167932313600?style=for-the-badge&logo=discord&color=A1A8F4&logoColor=5865F2&labelColor=302D41"></a>
  <a href="https://twitter.com/masca_io">
    <img alt="Twitter" src="https://img.shields.io/twitter/follow/masca_io?color=%2338B3FF&label=twitter&logo=Twitter&style=for-the-badge"></a>
</p>

<p align="center">· &nbsp&nbsp&nbsp· &nbsp&nbsp&nbsp·</p>

<p align="center">
Masca enables everyone to build their <b>decentralized and self-sovereign identity by enhancing MetaMask with functionalities to manage DIDs, VCs, and VPs.</b> Any website can connect to it to access identity data, and dapp developers can already start with the integration!
</p>

<p align="center">· &nbsp&nbsp&nbsp· &nbsp&nbsp&nbsp·</p>

# Features

Masca is built agnostic, leaving the user to choose his preferred **blockchain, DID method, and data storage provider.** Everything is configurable, just like selecting the network in MetaMask. Currently supported technologies:

- **Blockchains:** Any EVM-based blockchain that is supported by DID methods
- **DID methods:** `did:ethr`, `did:key`, `did:key (EBSI)` `did:pkh`, `did:jwk`, `did:polygonid`, `did:iden3`
- **Protocols**: OpenID Connect, Polygon ID
- **Credentials and Presentations:** Create & Verify Credentials/Presentations
- **Data storage providers:** Local MetaMask Snap state, Ceramic Network

Many new features are already in the works. For more information, please check the [roadmap](https://docs.masca.io/docs/roadmap) on the documentation.

# Development

### Versions

Every version of Masca does NOT work with every version of MetaMask Flask! Here is a table of compatible versions:

| Masca version | MetaMask Flask version |
| ------------- | ---------------------- |
| 0.1.0         | 10.29.0                |
| 0.2.0         | 10.31.0                |
| 0.3.0         | 10.32.0                |
| 0.4.0         | 10.32.0                |

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/)
  - ⚠️ You cannot have other versions of MetaMask installed
- Node.js `18`. We **strongly** recommend you install via [NVM](https://github.com/creationix/nvm) to avoid incompatibility issues between different node projects.
  - Once installed, you should also install [pnpm](https://pnpm.io/) with `npm i -g pnpm` to make working with this repository easiest.

## Running

- Run `pnpm build`

### Snap

- To start the Snap run `pnpm nx start @blockchain-lab-um/masca`
- Snap can be tested on `localhost:8081/` or on Masca website

### Website

- To start the Website run `pnpm nx start @blockchain-lab-um/dapp`

### Docs

- To start the Website run `pnpm nx start @blockchain-lab-um/masca-docs`

# Feature requests

Is Masca missing some crucial features? For new features and other enhancements, please [**open a new issue**](https://github.com/blockchain-lab-um/masca/issues/new/choose). If you are unsure if it fits in the Snap, [**start a new discussion**](https://github.com/blockchain-lab-um/masca/discussions/new/choose) under the Discussions tab.

# Rebrand

Masca was previously called SSI Snap; thus, the old name can still appear in some places. You can also find earlier versions of the Snap under the SSI Snap packages.

# Licenses

This project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
