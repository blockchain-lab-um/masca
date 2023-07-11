---
sidebar_position: 2
---

# Getting Started

Masca is a **MetaMask Snap** (extension) that supports **Decentralized Identity**, enabling the management of **DIDs**, creating and storing **VCs**, and creating **VPs**. It can also be used to **validate** VCs and VPs and **resolve DIDs**. It is designed to be blockchain-agnostic.

#### With Masca being a MetaMask extension, developers can effortlessly implement its features into any dApp that already supports MetaMask and does not require users to install or use any additional Software!

You can find more information [here](category/decentralized-or-self-sovereign-identity-ssi) if you're unsure what Decentralized or Self-Sovereign Identity is.

---

## User

### How to start using Masca?

Masca currently works only on **MetaMask Flask**. You can find it [here](https://metamask.io/flask/). Snaps are expected to be supported in the production MetaMask sometime in the second half of 2023. With that said, users will be able to connect to any dApp using Masca without any additional steps or software.

### Configuration dApp

We implemented an easy-to-use [dApp to configure Masca](https://masca.io) according to your needs and display your data. You can find the source code [here](https://github.com/blockchain-lab-um/masca).

### Demo Platform

We have also created a simple [Solidity Course demo dApp](https://blockchain-lab-um.github.io/course-dapp/) where you can receive your first VC and start building your decentralized identity!

---

## Developer

### Supporting Masca in your dApp

dApps can access Masca functionalities using the RPC methods like standard MetaMask/Ethereum ones. We have also developed an easy-to-use SDK **[Masca Connector](libraries/masca-connector)** to ease integration. The SDK provides all the functionalities to install Masca in a dApp and exposes an API for interacting with it.

Installing Masca Connector to your project:

```shell
pnpm add @blockchain-lab-um/masca-connector @blockchain-lab-um/utils
```

Masca installs and initializes using the function `enableMasca` . After the installation, `enableMasca` returns the `Masca` object used to retrieve the API.

A minimal example of initializing Masca and invoking one of the API methods:

```typescript
import { enableMasca } from '@blockchain-lab-um/masca-connector';
import { isError } from '@blockchain-lab-um/utils';

//Connect wallet & get Address
const address = await window.ethereum.request({
      method: 'eth_requestAccounts',
});

const masca = await enableMasca(address[0]);

if(isError(masca)){
    console.error(masca.error);
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

Jump to [**Masca Connector**](libraries/masca-connector) for more detailed documentation.

### Working with decentralized identity (DIDs, VCs, and VPs)

**Masca** serves as a snap for a user in the [SSI trust model](ssi/trust-model.md). Components of the SSI trust model are also issuers issuing VCs and verifiers verifying VPs. It is up to you as a dApp developer to define how/if you will issue VCs or how you will verify VPs and check their validity (scheme, subject, controller, content, etc.). We are also actively developing Issuer as a Service (ISSaaS) and Verifier as a Service (VaaS) methodologies, which will ensure seamless integration and easy deployment of these services with minimal technical configuration requirements. We strive to provide a plug-and-play experience, enabling users to leverage these services with minimal effort.

In the meantime, we recommend using **[Veramo Framework](https://veramo.io/)**. You can also examine our **[issuer's source code](https://github.com/blockchain-lab-um/course-backend)** used in our [Solidity Course demo dApp](https://blockchain-lab-um.github.io/course-dapp/).
