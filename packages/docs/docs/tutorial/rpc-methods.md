---
sidebar_position: 2
---

# JSON-RPC API

All of the types mentioned below can be found in the library `@blockchain-lab-um/masca-types`.

## VC Methods

### saveVC

#### Description

Used to store a VC in Masca. VC can be saved in one or more supported stores.

#### Parameters

1. verifiableCredential - VC, must be of type `W3CVerifiableCredential` from @veramo/core
2. options? - `SaveVCRequestParams`
   1. store? - string or array of strings. Defines where to store the VC

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'saveVC',
      params: {
        verifiableCredential: vc,
      },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'deleteVC',
      params: {
        id: '123',
        options: {
          store: 'snap',
        },
      },
    },
  },
});
```

#### Returns

An array of boolean (true, if VC deleted from store X, false if there was an error, or VC was not found)

### createVC

#### Description

Used to create a VC from payload. Proof format can be selected and the created VC can be optionally stored in snap.

#### Parameters

1. minimalUnsignedCredential - payload used to create VC. Needs to contain at least `type`, `credentialSubject`, `credentialSchema` and `@context`.
2. proofFormat - Can be `jwt`, `json-ld` or `EthereumEIP712Signature`.
3. options (optional) - `CreateVCOptions` object

```typescript

const payload: MinimalUnsignedCredential = {
  type: ['VerifiableCredential', 'Test Certificate'],
  credentialSubject: {
    accomplishmentType: 'Test Certificate',
    id: 'did:ethr:goerli:0x123...321',
  },
  credentialSchema: {
    id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
    type: 'JsonSchemaValidator2018',
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
  ],
};

const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'createVC'
      params: {
        minimalUnsignedCredential: payload,
        proofFormat: 'jwt',
        options: {
          save: 'true',
          store: ['snap'],
        },
    },
  },
  }
});
```

#### Returns

Returns a VC.

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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'createVP',
      params: {
        vcs: [{ id: '123', metadata: { store: 'ceramic' } }, { id: '456' }],
        proofFormat: 'jwt',
        options: {
          challenge: '123456789',
        },
      },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getDID',
    },
  },
});
```

### getDIDMethod

#### Description

Returns currently selected DID method

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getDIDMethod',
    },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'switchDIDMethod',
      params: {
        didMethod: 'did:ethr',
      },
    },
  },
});
```

#### Returns

New DID for current account

### getAvailableMethods

#### Description

Returns a list of supported DID methods

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getAvailableMethods',
    },
  },
});
```

## VC Store Methods

### getVCStore

#### Description

Get selected VC Store plugin

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getVCStore',
    },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'setVCStore',
      params: {
        store: 'ceramic',
        value: false,
      },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getAvailableVCStores',
    },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'togglePopups',
    },
  },
});
```

### resolveDID

#### Description

Resolve a DID

#### Parameters

1. did - did string

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'resolveDID',
      params: {
        did: 'did:ethr:0x01:0x123...321',
      },
    },
  },
});
```

#### Returns

`DIDResolutionResult` object, which contains DID Document if successful.

### verifyData

#### Description

Verify a VC or a VP validity.

#### Parameters

1. presentation - `W3CVerifiablePresentation` type object
OR
1. credential - `W3CVerifiableCredential` type object
2. verbose(optional) - boolean that changes the return value of this method 

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'verifyData',
      params: {
        credential: VC,
        verbose: true
      },
    },
  },
});
```

#### Returns

`boolean` if VC/VP is valid.

If `verbose` is set to true, it returns `IVerifyResult` instead, which also contains Error message.


### getAccountSettings

#### Description

Used to obtain settings of currently selected account

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getAccountSettings',
    },
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
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getSnapSettings',
    },
  },
});
```

#### Returns

Object with type

```typescript
export type MascaConfig = {
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
