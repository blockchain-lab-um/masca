---
sidebar_position: 1
---

# Masca Connector

Masca connector is used to install Masca and expose API toward snap on dApps and other applications.

For more details on Masca Connector, check [GitHub repo](https://github.com/blockchain-lab-um/ssi-snap/tree/master/packages/connector).

## Usage

### Install

`yarn add @blockchain-lab-um/masca-connector`

Connector has exposed function for installing the Snap.

```typescript
export async function enableMasca(
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

:::tip

More detailed description of methods & parameters is provided in chapter [JSON-RPC API](../tutorial/rpc-methods.md)

:::

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

## Connector methods

```typescript
/**
 * type QueryVCsRequestParams = {
 *  filter?: {
 *      type: 'id' | 'JSONPath' | 'none';
 *     filter: unknown;
 *    };
 *  options?: {
 *     store?: string | string[];
 *     returnStore?: boolean;
 *   };
 * };
 */

const vcs = await api.queryVCs({
  filter: { type: id, filter: '0x123321' },
  options: { returnStore: true, store: ['ceramic', 'snap'] },
});

/**
 * Create a VP from one or more VCs
 *
 * type CreateVPRequestParams = {
 *  vcs: VCRequest[];
 *  proofFormat?: 'jwt' | 'jsonld' | 'EthereumEip712Signature2021;
 *  proofOptions?: {
 *    type?: string
 *    domain?: string
 *    challenge?: string
 *  };
 * };
 *
 * type VCRequest = {
 *  id: string,
 *  metadata?: {
 *    store?: string
 *  }
 * }
 */
const vp = await api.createVP({
  vcs: [{ id: '123', metadata: { store: 'ceramic' } }, { id: '456' }],
  proofFormat: 'jwt',
  proofOptions: {
    domain: '123',
    challenge: '456',
  },
});

/**
 * Save a VC in Masca under currently selected MetaMask account
 *
 * @param {W3CVerifiableCredential} vc - vc
 * @param {SaveVCOptions} options? - optional options param
 *
 * type SaveVCOptions =
 * {
 *  store?: string | string[]
 * }
 *
 */
const res = await api.saveVC(verifiableCredential, {
  store: ['snap', 'ceramic'],
});

const res = await api.deleteVC('0x123', {
  store: ['snap', 'ceramic'],
});

const did = await api.getDID();

const method = await api.getSelectedMethod();

const methods = await api.getAvailableMethods();

const res = await api.switchDIDMethod('did:key');

const res = await api.togglePopups();

const vcStores = await api.getVCStore();

const availableVCStores = await api.getAvailableVCStores();

const res = await api.setVCStore('ceramic', true);

const res = await api.changeInfuraToken(infuraToken);

const snapSettings = await api.getSnapSettings();

const accountSettings = await api.getAccountSettings();
```

**More detailed list of methods can be found [here](./../tutorial/implementation.md)!**
