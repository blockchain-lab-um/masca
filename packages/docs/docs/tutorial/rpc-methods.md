---
sidebar_position: 2
---

# JSON-RPC API

You can find all of the types mentioned below in the library `@blockchain-lab-um/masca-types` .

## VC Methods

### saveVC

#### Description

`saveVC` stores a VC in Masca. VC can be saved in one or more supported stores.

#### Parameters

1. `verifiableCredential` - type `W3CVerifiableCredential` from `@veramo/core`
2. `options?` - `SaveVCRequestParams`.
   1. `store?` - `string` or `string[]` . Defines where to store the VC.

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

`SaveVCRequestResult[]`

### queryVCs

#### Description

`queryVCs` gets a list of VCs stored by the currently selected MetaMask account. Optional parameter `params` is an `object` with optional properties `filter` , and `options` .

`filter` defines what `queryVCs` returns, and `options` defines where to search for data and what format to return it in.

`QueryVCsRequestParams` :

Currently, three different `filter` types are supported; `none` , `id` , and `JSONPath` . Type `none` will work as if no filter property was provided, `id` will search for matching ID of VC and `JSONPath` will use [ `jsonpath` ](https://www.npmjs.com/package/jsonpath) to find matching VCs.

In the case of `id` , `filter.filter` is an id `string` .

In the case of `JSONPath` , `filter.filter` is a `string` containing JSONPath `string` .

:::info NOTE

Query needs to start with `@.data` while filtering VC alone.

:::

Example:

```typescript
const jsonPath =
  '$[?(@.data.credentialSubject.achievement == "Certified Solidity Developer 2")]';
```

`options` define where to search for VCs. One or more supported stores can be provided. If `returnStore` is enabled, metadata of returned VCs will contain a string where they're stored

#### Parameters

1. `filter?` - `QueryVCsRequestParams` object.
2. `options?` - `QueryVCsOptions` object.

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

`QueryVCsRequestResult[]`

### deleteVC

#### Description

`deleteVC` deletes a VC from one or more stores, based on an ID obtained with `queryVCs` method.

#### Parameters

1. `id` - `id` of a VC.
2. `options?` - `DeleteVCsOptions` object.

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

`boolean[]` - `true` , if VC deleted from store X, `false` if there was an error, or a VC was not found.

### createVC

#### Description

`createVC` creates a VC from the payload. `proofFormat` can be selected, and the created VC can be optionally stored in the snap.

#### Parameters

1. `minimalUnsignedCredential` - payload used to create a VC. Needs to contain at least `type`, `credentialSubject`, `credentialSchema` and `@context`.
2. `proofFormat` - Can be `jwt`, `json-ld` or `EthereumEIP712Signature`.
3. `options?` - `CreateVCOptions` object.

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

`VerifiableCredential`

### createVP

#### Description

`createVP` gets a VP for one or more passed VCs. `params` object is of type:

```typescript
export type CreateVPRequestParams = {
  vcs: W3CVerifiableCredential[];
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

`vcs` is of type `W3CVerifiableCredential[]` .

`proofFormat` can be `jwt` , `jsonld` or `EthereumEip712Signature2021` .

`options?` defines `domain` , `type` , and `challenge` if needed.

`holder` of the VP will be a DID generated based on the currently selected MetaMask account **AND** the currently set DID Method.

#### Parameters

1. `vcs` - `VCRequest[]`.
2. `proofFormat?` - `string`, `jwt` by default
3. `proofOptions?` - `ProofOptions` object

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'createVP',
      params: {
        vcs: [verifiableCredentialObject],
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

`VerifiablePresentation`

## DID Methods

### getDID

#### Description

`getDID` generates and returns a DID based on the currently set MetaMask Account **AND** DID method.

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

`getDIDMethod` returns the currently selected DID method.

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

`switchDIDMethod` switches the DID method.

#### Parameters

1. `didMethod` - name of the did method to switch to (`did:ethr`, `did:key`, or `did:pkh` etc.). Must be one of the methods returned by `getAvailableMethods`.

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

`string` - DID for the newly selected method.

### getAvailableMethods

#### Description

`getAvailableMethods` returns a `string[]` list of supported DID methods.

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

`getVCStore` gets the selected VC Store plugin.

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

#### Returns

A `Record` of `VCStores[]` and whether or not they're enabled. By default both snap & ceramic are enabled.

### setVCStore

#### Description

`setVCStore` changes the selected VC Store plugin.

#### Parameters

1. `store` - name of the VC Store plugin (`"snap"` or `"ceramic"`). Must be one of methods returned by `getAvailableVCStores`.
2. `value` - `boolean`. Enable/disable specific store plugins.

:::danger BE CAREFUL!

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

`boolean`

### getAvailableVCStores

#### Description

`getAvailableVCStores` gets a `string[]` list of supported VC Store plugins.

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

`strings[]`

## Snap Methods

### togglePopups

#### Description

`togglePopups` toggles popups that show up whenever the user tries to save a VC, generate a VP, etc. Popups are enabled by default to keep user in total control of their actions. With popups disabled, a dApp can query user's credentials, etc. without them knowing. We recommend using `addFriendlyDapp` instead to only trust specific dApps.

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

### addFriendlyDapp

#### Description

`addFriendlyDapp` adds the current dApp (origin of the current dApp) to the list of friendly dApps. Friendly dApps do not show popups.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'addFriendlyDapp',
    },
  },
});
```

### togglePopups

#### Description

`removeFriendlyDapp` removes a dApp from friendly dApps.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'removeFriendlyDapp',
      params: {
        dApp: 'https://www.masca.io',
      },
    },
  },
});
```

### resolveDID

#### Description

`resolveDID` resolves a DID.

#### Parameters

1. `did` - DID `string`.

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

`DIDResolutionResult` , containing DID Document if successful.

### verifyData

#### Description

`verifyData` verify a VC or a VP validity.

#### Parameters

1. `presentation` - `W3CVerifiablePresentation` object
   OR
2. `credential` - `W3CVerifiableCredential` object
3. `verbose?` - `boolean` that changes the return value of this method

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'verifyData',
      params: {
        credential: VC,
        verbose: true,
      },
    },
  },
});
```

#### Returns

`boolean` - `true` if VC/VP is valid, `false` otherwise.

If `verbose` is set to `true` , it returns `IVerifyResult` instead, which also contains an Error message.

### getAccountSettings

#### Description

`getAccountSettings` obtains the settings of the currently selected account.

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

`SSIAccountConfig`

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

`getSnapSettings` obtains the settings of the snap.

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

`MascaConfig`

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

### setCurrentAccount

#### Description

`setCurrentAccount` sets the account in Masca. This is required for Masca to work properly. Without appropriately calling this method, switching accounts in MetaMask will **NOT** result in switching accounts in Masca!

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'setCurrentAccount',
      params: {
        currentAccount: '0x123...321',
      },
    },
  },
});
```

#### Parameters

1. `currentAccount` - `string` of address of the account to set as current.

#### Returns

`boolean`

:::info NOTE

We recommend calling this method in `window.ethereum.on('accountsChanged', handler: (accounts: Array<string>);` . See [Account Switching](./implementation.md#account-switching).

:::

### setCeramicSession

#### Description

`setCeramicSession` sets the Ceramic session. As an Ethereum account handles storing and retrieving items from Ceramic, generating a session has to be done manually by a dApp. This is already handled in our Masca Connector. You can follow our [implementation in the connector](https://github.com/blockchain-lab-um/masca/blob/744b2e651dda15e7b44af894294692925c9a4964/packages/connector/src/utils.ts#L14) to implement this yourself.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'setCeramicSession',
      params: {
        serializedSession: '...',
      },
    },
  },
});
```

#### Returns

`boolean`

### validateStoredCeramicSession

#### Description

`validateStoredCeramicSession` checks if there is an existing ceramic session set in Masca and if it's still valid. If this method returns `false` , the session must be set to use Ceramic!

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'validateStoredCeramicSession',
    },
  },
});
```

#### Returns

`boolean`
