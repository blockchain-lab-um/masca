# SSI Snap

The SSI Snap is a MetaMask Snap that enhances MetaMask with functionality to manage DIDs, VCs and VPs. SSI Snap uses DID:ETHR method.

## [Documentation](https://blockchain-lab-um.github.io/ssi-snap-docs/)

### Testing SSI Snap

#### Metamask

First, build and install beta release of Metamask extension:

- checkout to [this branch](https://github.com/MetaMask/metamask-extension/tree/snaps-stable-nov-21) (chrome recommended)
- build metamask using `yarn start --build-type flask` or `yarn dist`
- go to [chrome://extensions/](chrome://extensions/)
- enable "Developer mode"
- click "Load unpacked" and point to chrome directory

##### Live demo

## [Demo](https://blockchain-lab-um.github.io/course-dapp/)

#### Demo Snapshot

##### Running SSI Snap demo locally

Start our demo locally by running:

- `yarn install`
- `yarn run demo`

## License

This project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
