---
sidebar_position: 2
---

# Getting Started

The **SSI Snap** is a MetaMask Snap, that can handle **DIDs**, securely store **VCs**, create **VPs** and is designed to be blockchain-agnostic.

---

## User

### Using the Snap

In order to install and test the Snap, you will need to install [MetaMask Flask](https://metamask.io/flask/).

You can install the Snap in [Configuration Page](config) or by simply connecting to our [Platform](https://blockchain-lab-um.github.io/course-dapp/) or select it from the [Snaplist](https://snaplist.org/)

#### Testing on testnet

To test on the testnet get some test ether from a [rinkeby faucet](https://faucets.chain.link/rinkeby). The snap can be tested on our [Platform](https://blockchain-lab-um.github.io/course-dapp/).

#### Running SSI Snap locally

Build and test locally

- `yarn install`
- `yarn start`

Demo should open on localhost:8081

---

## Developer

### Implementing the Snap in a dApp

For snap to work, users will have to install it and connect to the dApp. Once user connects MetaMask to the dApp, dApp can request a list of installed snaps. If SSI Snap is not installed user can be requested to install it .

We developed a simple library called [SSI Snap Connector](plugins/ssi-snap-connector) to make interacting with SSI Snap easy. SSI Snap Connector comes with a function that checks if installed MetaMask supports Snaps, if SSI Snap is installed and with an API for interacting with the Snap.

To `install` the SSI Snap:

_NOTE:_ _Snap can also be installed using a 3rd party Platform such as our [Platform](https://blockchain-lab-um.github.io/course-dapp/) or [Snaplist](https://snaplist.org/)._

`yarn add @blockchain-lab-um/ssi-snap-connector`

`enableSSISnap` is a function used to install the SSI Snap.

After snap installation, this function returns `MetamaskSSISnap` object that can be used to retrieve snap API.
An example of initializing SSI snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const metamaskSSISnap = await enableSSISnap();
const api = metamaskSSISnap.getSSISnapApi();

// invoke API
const vcs = await api.getVCs();

console.log('list of VCs:', vcs);
```

More detailed documentation of `SSISnapConnector` can be found **[here](plugins/ssi-snap-connector)**.

### Working with VCs

It is up to the dApp to issue VCs and/or request VPs/VCs and verify their validity (scheme, subject, controller, content, etc.). We recommend using [Veramo Framework](https://veramo.io/). For implementation references take a look at our [dApp](https://github.com/blockchain-lab-um/course-dapp) and [backend](https://github.com/blockchain-lab-um/course-backend) code.
