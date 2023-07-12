---
sidebar_position: 1
---

# Masca Connector

Masca connector is used to install Masca and expose an API toward snap on dApps and other applications.

For more details on Masca Connector, check [GitHub repo](https://github.com/blockchain-lab-um/ssi-snap/tree/master/packages/connector).

## Usage

### Install

```bash
pnpm add @blockchain-lab-um/masca-connector
```

Connector has an exposed function for installing the Masca snap. For ease of use, the connector package also exposes all the functions and types from `@blockchain-lab-um/masca-types` and `@blockchain-lab-um/utils` NPM packages.

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

When installing Masca it is possible to set a custom `snapId` if you do not want to instal it from the official repository.

It is also possible to use custom version and set a list of supported methods. If connected Masca does not currently have one of the supported methods selected, `switchMethod` RPC method will be automatically called.

After snap installation, this function returns `Masca` object that can be used to retrieve snap API.
An example of initializing Masca and invoking snap API is shown below.

For Masca to work properly, it needs to know the address of the connected account. Initially this can be done by passing the address as a parameter to `enableMasca` function. Later, the address can be changed using the `setCurrentAccount` RPC method!

:::tip

More detailed description of methods & parameters is provided in chapter [JSON-RPC API](../tutorial/rpc-methods.md)

:::

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Install Masca and retrieve the API interface
const masca = await enableMasca(address);

if(isError(masca)){
    console.error(enableResult.error);
    return;
}

const api = masca.data.getMascaApi();

// Invoke the API
const vcs = await api.queryVCs();

if(isError(masca)){
    console.error(vcs.error);
    return;
}

console.log('list of VCs:', vcs.data);
```

## Connector methods

**More detailed list of methods can be found [here](./../tutorial/implementation.md)!**
