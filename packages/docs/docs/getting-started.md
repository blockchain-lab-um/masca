---
sidebar_position: 2
---

# Getting Started

Masca is a **MetaMask Snap** (extension) that adds support for **SSI**: it can manage **DIDs**, store **VCs**, and create the **VPs**. It is designed to be blockchain-agnostic.

---

## User

### How to start using Masca?

Masca currently works only on **MetaMask Flask**. You can find it [here](https://metamask.io/flask/). Snaps are expected to come to the main MetaMask sometime in the second half of 2023.

After that, connect to any dApp that uses Masca, and you are good to go!

### Configuration dApp

We implemented an easy-to-use dApp to configure Masca according to your needs and display your data. You can find it [here](https://github.com/blockchain-lab-um/masca).

### Demo Platform

We also implemented a simple [course platform](https://blockchain-lab-um.github.io/course-dapp/) where you can receive your very first VC and start building your decentralized identity!

---

## Developer

### Supporting Masca in your dApp

dApp can access the functionalities of Masca using the RPC methods the same way as standard MetaMask/Ethereum ones. We also developed an easy-to-use library called **[Masca Connector](libraries/masca-connector)** to ease the integration process. Library provides all the functionalities to install Masca in the dApp and API calls for interacting with Snap.

Installing Masca Connector to your project:

`yarn add @blockchain-lab-um/masca-connector`

Masca is installed and enabled using the function `enableMasca`. After the Snap is installed, this function returns `Masca` object that you can use to retrieve the API interface.

A minimal example of initializing Masca and invoking one of the API methods:

```typescript
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';
// install Masca and retrieve API interface
const masca = await enableMasca();

if(isError(masca)){
    console.error(enableResult.error);
    return;
}

const api = masca.data.getMascaApi();

// invoke API
const vcs = await api.queryVCs();

if(isError(masca)){
    console.error(vcs.error);
    return;
}

console.log('list of VCs:', vcs.data);
```

More detailed documentation of **Masca Connector** can be found **[here](libraries/masca-connector)**.

### Working with decentralized identity (DIDs, VCs, and VPs)

**Masca** serves as a snap for a user in the SSI trust model. There are also issuers who issue VCs and verifiers who verify VPs. It is up to you as a dApp developer to define how/if you will issue VCs or how you will verify VPs and check their validity (scheme, subject, controller, content, etc.). We are developing issuer and verifier services that will be easy to spin up and usable out of the box. In the meantime, we recommend using **[Veramo Framework](https://veramo.io/)**. You can also look at our code for the **[issuer](https://github.com/blockchain-lab-um/course-backend)** of the Demo Platform.
