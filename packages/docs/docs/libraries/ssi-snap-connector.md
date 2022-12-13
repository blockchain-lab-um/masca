---
sidebar_position: 1
---

# SSI Snap Connector

SSI Snap connector is used to install SSI snap and expose API toward snap on dApps and other applications.

For more details on SSI Snap Connector itself see [ssi-snap-connector repo](https://github.com/blockchain-lab-um/ssi-snap-connector).

:::danger

Ceramic network and DID:KEY support are experimental and still under development!

:::

## Usage

### Install

`yarn add @blockchain-lab-um/ssi-snap-connector`

Connector has exposed function for installing the Snap.

```typescript
export async function enableSSISnap(
  {
    snapId?: string;
    version?: string;
    supportedMethods?: Array<typeof availableMethods[number]>;
  }): Promise<MetaMaskSSISnap>;
```

When installing the SSI Snap it is possible to set a custom `snapId` if you do not want to instal it from the official repository.

It is also possible to use custom version and set a list of supported methods. If connected SSI Snap does not currently have one of the supported methods selected, `switchMethod` RPC method will be automatically called.

After snap installation, this function returns `MetamaskSSISnap` object that can be used to retrieve snap API.
An example of initializing SSI snap and invoking snap API is shown below.

:::tip

More detailed description of methods & parameters is provided in chapter [JSON-RPC API](../tutorial/rpc-methods.md)

:::

```typescript
// install snap and fetch API
const snap = await enableSSISnap({ version: 'latest' });
const api = await snap.getSSISnapApi();

// invoke API
const vcs = await api.queryVCs();

console.log('list of VCs:', vcs);
```

## Connector methods:

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
 * Save a VC in the SSI Snap under currently selected MetaMask account
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

/**
 *  Get settings for Snap & currently selected account
 */
const snapSettings = await api.getSnapSettings();

const accountSettings = await api.getAccountSettings();
```

#### Utility methods

SSI Snap Connector also comes with additional utility methods such as `isSnapInstalled`, `isMetamaskSnapsSupported` and `hasMetamask`.
