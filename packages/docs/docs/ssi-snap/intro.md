---
sidebar_position: 1
---

# MetaMask Snaps - Basics

The most popular wallet, **[MetaMask](https://metamask.io/)**, introduced **[Snaps](https://docs.metamask.io/guide/snaps.html)**, which makes building plugins for additional functionality possible. MetaMask is a crypto wallet and gateway to blockchain apps, providing a simple interface for users to interact with EVM-based blockchains, sign and send transactions, etc. Snaps make a wide specter of new applications possible. They can enable support for previously unsupported chains like Polkadot, Solana, Bitcoin, etc. They allow dApps to modify MetaMask's state to store and retrieve data, like VCs. They also enable access to the web and the possibility to leverage practically any API and much more. New functionality is only limited by the creativity of developers. Here is a [list](https://github.com/piotr-roslaniec/awesome-metamask-snaps) of already developed Snaps!

Technically speaking, MetaMask Snaps is a system that allows anyone to expand the capabilities of MetaMask safely. It is a JavaScript program that runs in an isolated, sandboxed environment inside the MetaMask. In addition to the existing MetaMask RPC methods, Snaps can create new RPC methods for websites to call. Unfortunately, that is the only way to interact with the Snaps, as modifying MetaMask UI is not possible (at least at the moment.)

Snaps are currently only supported in the [MetaMask Flask](https://metamask.io/flask/), a separate desktop browser extension for developers. But it is expected that the Snap system will be integrated into the main MetaMask in the future. For more information about Snaps, check their [documentation](https://docs.metamask.io/guide/snaps.html).
