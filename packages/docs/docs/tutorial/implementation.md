---
sidebar_position: 1
---

# How To Implement It?

The **SSI Snap** is a MetaMask Snap, that can handle **DIDs**, securely store **VCs**, create **VPs** and is designed to be blockchain-agnostic.

:::danger

Ceramic network and DID:KEY support are experimental and still under development!

:::

## Implementing the Snap in a dApp

### Using the SSI Snap Connector

`yarn add @blockchain-lab-um/ssi-snap-connector`

Connector has exposed function for installing the Snap.

After snap installation, this function returns `MetamaskSSISnap` object that can be used to retrieve snap API.
An example of initializing SSI snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const snap = await enableSSISnap({
  snapId: snapId,
  version: 'latest',
  supportedMethods: ['did:ethr', 'did:key'],
});
const api = await snap.getSSISnapApi();
```

SSI Snap Connector will take care of initializing the Snap for other DID methods (Needed to extract the public key) during the enableSSISnap function and whenever account changes.

### Save VC

`saveVC` is used to save a VC under the currently selected MetaMask account. Parameter `vc` is a `W3CVerifiableCredential` VC. Invalid format might lead to failure when generating VPs. We recommend using Veramo to generate VCs with this [interface](https://veramo.io/docs/api/core.verifiablecredential). Optional parameter `options` defines where the VC will get saved. VC can be stored in one or more places at the same time.

```typescript
const res = await api.saveVC(verifiableCredential, {
  store: ['ceramic', 'snap'],
});
```

### Query VCs

`queryVCs` is used to get a list of VCs stored by the currently selected MetaMask account. Optional parameter `params` is an object with optional properties `filter` and `options`.

Filter defines what `queryVCs` returns and Options defines where to search for data and what format to return it in.

QueryVCsRequestParams type:

```typescript
type QueryVCsRequestParams = {
  filter?: {
    type: string;
    filter: unknown;
  };
  options?: {
    store?: AvailableVCStores | AvailableVCStores[];
    returnStore?: boolean;
  };
};
```

Currently, 3 different `filter` types are supported; `none`, `id`, and `JSONPath`. Type `none` will work as if no filter property was provided, `id` will search for matching ID of VC and `JSONPath` will use jsonpath lib to find matching VCs.

In the case of `id`, filter.filter is a string of an id.

In the case of `JSONPath` , filter.filter is a string containing JSONPath string. Note: query needs to start with @.data while filterin VC alone. Example:

```typescript
const jsonPath =
  '$[?(@.data.credentialSubject.achievement == "Certified Solidity Developer 2")]';
```

Options defines where to search for VCs. One or more supported stores can be provided. If `returnStore` is enabled, metadata of returned VCs will contain a string where they're stored

```typescript
// Get a single VC or a list of VCs you're looking for
const vcs = await api.queryVCs({
  filter: {
    type: id,
    filter: '123456',
  },
  options: {
    returnStore: true,
  },
});
console.log('VCs', vcs);

// To return every VC
const vcs = await api.queryVCs();
```

### Create VP

`createVP` is used to get a VP for one or more specific VCs. Params object is of type:

```typescript
export type CreateVPRequestParams = {
  vcs: VCRequest[];
  proofFormat?: 'jwt' | 'lds' | 'EthereumEip712Signature2021';
  proofOptions?: {
    type?: string;
    domain?: string;
    challenge?: string;
  };
};

export type VCRequest = {
  id: string;
  metadata?: {
    store?: AvailableVCStores;
  };
};
```

`vcs` is a list of VCs to be included in a VP. Its an array of objects that need to contain `id` of a VC (Which can be obtained using the `queryVCs` method). `metadata` property is optional and it contains `store` property which defines where to look for VC with id `id`.

`proofFormat` can be jwt, jsonld or EthereumEip712Signature2021.

`options` is optional and is used to define `domain`, `type` and `challenge` if needed.

`holder` of the VP will be a DID generated based on currently selected MetaMask account AND currently selected DID Method.

```typescript
// Get VP
const vp = await api.createVP({
  vcs: [{ id: '123', metadata: { store: 'ceramic' } }, { id: '456' }],
  proofFormat: 'jwt',
  options: {
    challenge: '123456789',
  },
});
```

### Delete VC

`deleteVC` is used to delete a VC from one or more stores

`id` - id of VC

`options` is optional and is used to select a store where to delete VC from.

```typescript
const res = await api.deleteVC('123', { store: 'snap' });
```

### DID

`getDID` and `getSelectedMethod` are used to get current did and currently selected did method.

```typescript
const res = await api.getDID();

const res = await api.getSelectedMethod();
```

### Supported DID methods and VC Stores

`getAvailableVCStores` and `getAvailableMethods` are used to get all supported methods and vcstores

```typescript
const supportedMethods = await api.getAvailableMethods();

const supportedStores = await api.getAvailableVCStores();
```

### Switch DID Method

`switchMethod` is used to switch the currently selected DID method.

```typescript
await api.switchMethod('did:key');
```

### Configure VC Stores

`setVCStore` is used to enable/disable specific VC store. By default both snap & ceramic are enabled!

```typescript
const res = await api.setVCStore('ceramic', false);
```

### Snap settings

`togglePopups` and `changeInfuraToken` are used to enable/disable "Are you sure?" alerts and to change the infuraToken.

```typescript
const res = await api.changeInfuraToken('new token');

const res = await api.togglePopups();
```

_NOTE:_ _Snap can also be installed using a 3rd party Platform such as our [Platform](https://blockchain-lab-um.github.io/course-dapp/) or [Snaplist](https://snaplist.org/)._

#### For a more detailed look at SSI Snap Connector visit its [documentation](../libraries/ssi-snap-connector)!

If you need more help with implementation feel free to contact us in Discord, or check the [DEMO Platform repo](https://github.com/blockchain-lab-um/course-dapp)!

### Working with VCs

It is up to the dApp to issue VCs and/or request VPs/VCs and verify their validity (scheme, subject, controller, content, etc.). We recommend using the [Veramo Framework](https://veramo.io/).
