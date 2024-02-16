---
sidebar_position: 1
---

# Start here

## Supporting Masca in your dapp

Dapps can access Masca functionalities using RPC methods like standard MetaMask/Ethereum ones. We have also developed an easy-to-use SDK **[Masca Connector](/docs/libraries/masca-connector)** to ease integration. The SDK provides all the functionalities to install Masca in a dapp and exposes an API for interacting with it.

Installing Masca Connector to your project:

```shell
pnpm add @blockchain-lab-um/masca-connector
```

Masca installs and initializes using the function `enableMasca` . After successful installation, `enableMasca` returns the `Masca` object used to retrieve the API.

The following is a minimal example of initializing Masca and invoking one of the API methods.

:::tip [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963)

We moved the whole logic of handling wallet providers in EIP-6963 way into Masca Connector SDK. The connector will use the MetaMask provider at all times if available. If not available, the connector will throw error. You still can and should handle providers in your own way on dapp, since some methods such as `eth_requestAccounts` and SIWE features need to use MetaMask provider in order to work with our Masca Connector SDK. A great example of how to do this can be found [here](https://github.com/Montoya/snap-connect-example#readme).

:::

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Connect the user and get the address of his current account
const accounts = await provider.request({ // provider here is received in an EIP-6963 compliant way, see the tip above
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
  console.error(enableResult.error)
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

## Polygon ID

Learn more on this [page](/docs/integrate-masca/polygonid.md).

## OpenID for Verifiable Credentials (OID4VC)

Learn more on this [page](/docs/integrate-masca/oid4vc.md).

## Working with decentralized identity (DIDs, VCs, and VPs)

**Masca** serves as a snap for a user in the [SSI trust model](ssi/trust-model.md). Components of the SSI trust model are also issuers issuing VCs and verifiers verifying VPs. It is up to you as a dapp developer to define how/if you will issue VCs or how you will verify VPs and check their validity (scheme, subject, controller, content, etc.). We are also actively developing Issuer as a Service (ISSaaS) and Verifier as a Service (VaaS) methodologies, which will ensure seamless integration and easy deployment of these services with minimal technical configuration requirements. We strive to provide a plug-and-play experience, enabling users to leverage these services with minimal effort.
