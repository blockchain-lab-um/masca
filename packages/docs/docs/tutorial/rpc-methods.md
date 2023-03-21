---
sidebar_position: 2
---

# JSON-RPC API

All of the types mentioned below can be found in the library `@blockchain-lab-um/ssi-snap-types`.

## VC Methods

### saveVC

#### Description

Used to store a VC in SSI Snap. VC can be saved in one or more supported stores.

#### Parameters

1. verifiableCredential - VC, must be of type `W3CVerifiableCredential` from @veramo/core
2. options? - `SaveVCRequestParams`
   1. store? - string or array of strings. Defines where to store the VC

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'saveVC',
    params: {
      verifiableCredential: vc,
    },
  },
});
```

#### Returns

Array of `SaveVCRequestResult` objects

### queryVCs

#### Description

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

#### Parameters

1. filter (optional) - `QueryVCsRequestParams` object
2. options (optional) - `QueryVCsOptions` object

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'queryVCs',
    params: {
      filter: {
        type: 'id',
        filter: '0x123456789',
      },
      options: {
        store: 'snap',
        returnStore: true,
      },
    },
  },
});
```

#### Returns

Array of `QueryVCsRequestResult` objects.

### deleteVC

#### Description

Used to delete a VC from one or more stores, based on an ID obtained with `queryVCs` method

#### Parameters

1. id - id of a VC
2. options (optional) - `DeleteVCsOptions` object

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'deleteVC',
    params: {
      id: '123',
      options: {
        store: 'snap',
      },
    },
  },
});
```

#### Returns

An array of boolean (true, if VC deleted from store X, false if there was an error, or VC was not found)

### createVP

#### Description

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

#### Parameters

1. vcs - an array of `VCRequest` objects.
2. proofFormat (optional) - proofFormat string, jwt by default
3. proofOptions (optional) - `ProofOptions` object

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    vcs: [{ id: '123', metadata: { store: 'ceramic' } }, { id: '456' }],
    proofFormat: 'jwt',
    options: {
      challenge: '123456789',
    },
  },
});
```

#### Returns

verifiable presentation

## DID Methods

### getDID

#### Description

Generates and returns a DID based on currently selected MetaMask Account and DID Method.

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getDID',
  },
});
```

### getDIDMethod

#### Description

Returns currently selected DID method

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getDIDMethod',
  },
});
```

### switchDIDMethod

#### Description

Switch the DID method

#### Parameters

1. didMethod - name of did method (`did:ethr`, `did:key`, or `did:pkh`). Must be one of methods returned by `getAvailableMethods`.

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'switchDIDMethod',
    params: {
      didMethod: 'did:ethr',
    },
  },
});
```

### getAvailableMethods

#### Description

Returns a list of supported DID methods

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getAvailableMethods',
  },
});
```

## VC Store Methods

### getVCStore

#### Description

Get selected VC Store plugin

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getVCStore',
  },
});
```

####

Returns an Record of VCStores and whether or not they're enabled. By default both snap & ceramic are enabled

### setVCStore

#### Description

Change the selected VC Store plugin

#### Parameters

1. store - name of VC Store plugin ("snap" or "ceramic"). Must be one of methods returned by `getAvailableVCStores`.
2. value - boolean. Enable/disable specific store plugin

:::danger

Ceramic Network support is experimental and still under active development!

:::

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'setVCStore',
    params: {
      store: 'ceramic',
      value: false,
    },
  },
});
```

#### Returns

boolean

### getAvailableVCStores

#### Description

Get a list of supported VC Store plugins

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getAvailableVCStores',
  },
});
```

#### Returns

Array of strings of available VCStores

## Snap Methods

### togglePopups

#### Description

Used to disable popups that show up whenever user tries to save a VC, generate a VP, etc.

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'togglePopups',
  },
});
```

### changeInfuraToken

#### Description

change the Infura token used by SSI Snap

#### Parameters

1. infuraToken - new infura token

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'changeInfuraToken',
    params: {
      infuraToken: 'abcdefg',
    },
  },
});
```

#### Returns

boolean

### getAccountSettings

#### Description

Used to obtain settings of currently selected account

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getAccountSettings',
  },
});
```

#### Returns

Object with type

```typescript
export type SSIAccountConfig = {
  ssi: {
    didMethod: AvailableMethods;
    vcStore: Record<AvailableVCStores, boolean>;
  };
};
```

### getSnapSettings

#### Description

Used to obtain settings of the snap

```typescript
const response = await ethereum.request({
  method: `wallet_snap_${snapId}`,
  params: {
    method: 'getSnapSettings',
  },
});
```

#### Returns

Object with type

```typescript
export type SSISnapConfig = {
  snap: {
    infuraToken: string;
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
};
```
