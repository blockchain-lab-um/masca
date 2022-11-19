---
sidebar_position: 2
---

# Getting Started

The SSI Snap is a **MetaMask Snap** (extension) that adds support for **SSI**: it can manage **DIDs**, store **VCs**, and create the **VPs**. It is designed to be blockchain-agnostic.

---

## User

### How to start using the SSI Snap?

SSI Snap currently works only on **MetaMask Flask**. You can find it [here](https://metamask.io/flask/). Snaps are expected to come to the main MetaMask in 2023.

After that, connect to any dApp that uses SSI Snap, and you are good to go!

### Configuration dApp

We implemented an easy-to-use dApp to configure SSI Snap according to your needs and display your data. You can find it [here](https://blockchain-lab-um.github.io/ssi-snap).

### Demo Platform

We also implemented a simple [course platform](https://blockchain-lab-um.github.io/course-dapp/) where you can receive your very first VC and start building your decentralized identity!

---

## Developer

### Supporting SSI Snap in your dApp

dApp can access the functionalities of SSI Snap using the RPC methods the same way as standard MetaMask/Ethereum ones. We also developed an easy-to-use library called **[SSI Snap Connector](plugins/ssi-snap-connector)** to ease the integration process. Library provides all the functionalities to install SSI Snap in the dApp and API calls for interacting with Snap.

Installing SSI Snap Connector to your project:

`yarn add @blockchain-lab-um/ssi-snap-connector`

SSI Snap is installed and enabled using the function `enableSSISnap`. After the Snap is installed, this function returns `MetamaskSSISnap` object that you can use to retrieve the API interface.

A minimal example of initializing SSI Snap and invoking one of the API methods:

```typescript
// install SSI Snap and retrieve API interface
const metamaskSSISnap = await enableSSISnap();
const api = metamaskSSISnap.getSSISnapApi();

// invoke API
const vcs = await api.getVCs();

console.log('list of VCs:', vcs);
```

More detailed documentation of **SSI Snap Connector** can be found **[here](plugins/ssi-snap-connector)**.

### Working with decentralized identity (DIDs, VCs, and VPs)

**SSI Snap** serves as a wallet for a user in the SSI trust model. There are also issuers who issue VCs and verifiers who verify VPs. It is up to you as a dApp developer to define how/if you will issue VCs or how you will verify VPs and check their validity (scheme, subject, controller, content, etc.). We are developing issuer and verifier services that will be easy to spin up and usable out of the box. In the meantime, we recommend using **[Veramo Framework](https://veramo.io/)**. You can also look at our code for the **[issuer](https://github.com/blockchain-lab-um/course-backend)** of the Demo Platform.
