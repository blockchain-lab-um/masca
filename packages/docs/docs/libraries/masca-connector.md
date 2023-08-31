---
sidebar_position: 1
---

# Masca Connector SDK

Masca connector installs Masca and exposes the API toward snap on dapps and other applications.

You can take a look at the [connector's codebase](https://github.com/blockchain-lab-um/ssi-snap/tree/master/packages/connector).

## Usage

### Install

```bash
pnpm add @blockchain-lab-um/masca-connector
```

Connector has an exposed method for installing the Masca snap. For ease of use, the connector package also exposes all the functions and types from `@blockchain-lab-um/masca-types` and `@blockchain-lab-um/utils` NPM packages.

```typescript
export async function enableMasca(
  address: string,
  {
    snapId?: string;
    version?: string;
    supportedMethods?: Array<typeof availableMethods[number]>;
  }
): Promise<Result<Masca>>;
```

When installing Masca it is possible to set a custom `snapId` if you do not want to install it from the official repository.

Using a custom version and setting a list of supported methods is also possible. If the connected Masca does not currently have one of the supported methods selected, `switchMethod` RPC method will be automatically called.

After snap installation, this function returns a `Masca` object that can be used to retrieve the API.
An example of initializing Masca and invoking the API is shown below.

For Masca to work correctly, it needs to know the address of the connected account. Initially, this is done by passing the address as a parameter to `enableMasca` function. Later, the address can be changed using the `setCurrentAccount` RPC method!

:::tip

A more detailed description of methods & parameters is provided in the chapter [Using the JSON-RPC API](/docs/integrate-masca/rpc-methods.md)

:::

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Connect the user and get the address of his current account
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});
const address = accounts[0];

// Enable Masca
const enableResult = await enableMasca(address);

// Check if there was an error and handle it accordingly
if (isError(enableResult)) {
  // Error message is available under error
  console.error(eneableResult.error)
  ...
}

// Now get the Masca API object
const api = await enableResult.data.getMascaApi();
```

## Connector methods

**A more detailed list of methods can be found [here](/docs/integrate-masca/masca-connector.md)!**
