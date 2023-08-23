---
sidebar_position: 1
---

# Start here

## Supporting Masca in your dApp

dApps can access Masca functionalities using RPC methods like standard MetaMask/Ethereum ones. We have also developed an easy-to-use SDK **[Masca Connector](libraries/masca-connector)** to ease integration. The SDK provides all the functionalities to install Masca in a dApp and exposes an API for interacting with it.

Installing Masca Connector to your project:

```shell
pnpm add @blockchain-lab-um/masca-connector
```

Masca installs and initializes using the function `enableMasca`. After the successful installation, `enableMasca` returns the `Masca` object used to retrieve the API.

The following is a minimal example of initializing Masca and invoking one of the API methods.

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Connect the user and get the address of his current account
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});
const address = accounts[0];

// Enable Masca
const enableResult = await enableMasca(address, {
  snapId: 'npm:@blockchain-lab-um/masca', // Defaults to `npm:@blockchain-lab-um/masca`
  version: '1.0.0', // Defaults to the latest released version
  supportedMethods: ['did:polygonid', 'did:pkh'], // Defaults to all available methods
});

// Check if there was an error and handle it accordingly
if (isError(enableResult)) {
  // Error message is available under error
  console.error(eneableResult.error)
  ...
}

// Now get the Masca API object
const api = await enableResult.data.getMascaApi();

// Example of invoking a RPC method call
// In this case, switching of the current did method
const switchMethodResult = await api.switchDIDMethod('did:polygonid');

// Check if there was an error and handle it accordingly
if (isError(enableResult)) {...}
```

Jump to [**Masca Connector**](/docs/libraries/masca-connector) for more detailed documentation.

## Working with decentralized identity (DIDs, VCs, and VPs)

**Masca** serves as a snap for a user in the [SSI trust model](ssi/trust-model.md). Components of the SSI trust model are also issuers issuing VCs and verifiers verifying VPs. It is up to you as a dApp developer to define how/if you will issue VCs or how you will verify VPs and check their validity (scheme, subject, controller, content, etc.). We are also actively developing Issuer as a Service (ISSaaS) and Verifier as a Service (VaaS) methodologies, which will ensure seamless integration and easy deployment of these services with minimal technical configuration requirements. We strive to provide a plug-and-play experience, enabling users to leverage these services with minimal effort.

In the meantime, we recommend using **[Veramo Framework](https://veramo.io/)**. You can also examine our **[issuer's source code](https://github.com/blockchain-lab-um/course-backend)** used in our [Solidity Course demo dApp](https://blockchain-lab-um.github.io/course-dapp/).
