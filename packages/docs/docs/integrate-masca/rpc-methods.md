---
sidebar_position: 5
---

# Using the JSON-RPC API

This section describes how to call Masca RPC methods, without the usage of the [Masca Connector SDK](/docs/libraries/masca-connector.md).
You can find all of the types mentioned below in the `@blockchain-lab-um/masca-types` library.

## VC Methods

### saveCredential

#### Description

`saveCredential` stores a VC in Masca. The VC can be saved in one or more supported stores.

#### Parameters

1. `verifiableCredential` - type `W3CVerifiableCredential` from `@veramo/core`
2. `options?` - `SaveCredentialRequestParams`.
   1. `store?` - `string` or `string[]`. Defines where to store the VC.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'saveCredential',
      params: {
        verifiableCredential,
      },
    },
  },
});
```

#### Returns

`SaveCredentialRequestResult[]`

### queryCredentials

#### Description

`queryCredentials` gets a list of VCs stored by the currently selected MetaMask account. Optional parameter `params` is an `object` with optional properties `filter`, and `options`.

`filter` defines what `queryCredentials` returns, and `options` defines where to search for data and what format to return it in.

`QueryCredentialsRequestParams` :

Currently, three different `filter` types are supported; `none`, `id`, and `JSONPath`. Type `none` will work as if no filter property was provided, `id` will search for matching ID of VC and `JSONPath` will use [ `jsonpath` ](https://www.npmjs.com/package/jsonpath) to find matching VCs.

In the case of `id`, `filter.filter` is an id `string`.

In the case of `JSONPath`, `filter.filter` is a `string` containing JSONPath `string`.

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

1. `filter?` - `QueryCredentialsRequestParams` object.
2. `options?` - `QueryCredentialsOptions` object.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'queryCredentials',
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

`QueryCredentialsRequestResult[]`

### deleteCredential

#### Description

`deleteCredential` deletes a VC from one or more stores, based on an ID obtained with `queryCredentials` method.

#### Parameters

1. `id` - `id` of a VC.
2. `options?` - `DeleteCredentialsOptions` object.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'deleteCredential',
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

`boolean[]` - `true`, if VC deleted from store X, `false` if there was an error, or a VC was not found.

### createCredential

#### Description

`createCredential` creates a VC from the payload. `proofFormat` can be selected, and the created VC can be optionally stored in the snap.

**Methods `did:pkh` and `did:ethr` will return an unsigned credential!** that needs to be signed manually on the dapp, as making signatures with Ethereum addresses is not possible in Masca. Here is an [example](https://github.com/blockchain-lab-um/masca/blob/bf00dbf4a4deb8882f76a293ffc565501d5dc2f9/packages/connector/src/utils.ts#L113-L170) of how we handle this in Connector.

#### Parameters

1. `minimalUnsignedCredential` - payload used to create a VC. Needs to contain at least `type`, `credentialSubject`, `credentialSchema` and `@context`.
2. `proofFormat` - Can be `jwt`, `json-ld` or `EthereumEIP712Signature`.
3. `options?` - `CreateCredentialOptions` object.

```typescript

const payload: MinimalUnsignedCredential = {
  type: ['VerifiableCredential', 'TestCertificate'],
  credentialSubject: {
    accomplishmentType: 'Test Certificate',
    id: 'did:ethr:sepolia:0x123...321',
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
      method: 'createCredential'
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

### createPresentation

#### Description

`createPresentation` gets a VP for one or more passed VCs. `params` object is of type:

```typescript
export type CreatePresentationRequestParams = {
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
    store?: AvailableCredentialStores;
  };
};
```

`vcs` is of type `W3CVerifiableCredential[]`.

`proofFormat` can be `jwt`, `jsonld` or `EthereumEip712Signature2021`.

`options?` defines `domain`, `type`, and `challenge` if needed.

`holder` of the VP will be a DID generated based on the currently selected MetaMask account **AND** the currently set DID Method.

**Methods `did:pkh` and `did:ethr` will return an unsigned presentation!** that needs to be signed manually on the dapp, as making signatures with Ethereum addresses is not possible in Masca. Here is an [example](https://github.com/blockchain-lab-um/masca/blob/bf00dbf4a4deb8882f76a293ffc565501d5dc2f9/packages/connector/src/utils.ts#L62C1-L111) of how we handle this in Connector.

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
      method: 'createPresentation',
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

If `verbose` is set to `true`, it returns `IVerifyResult` instead, which also contains an Error message.

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

`DIDResolutionResult`, containing DID Document if successful.

## VC Store Methods

### getCredentialStore

#### Description

`getCredentialStore` gets the selected VC Store plugin.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getCredentialStore',
    },
  },
});
```

#### Returns

A `Record` of `CredentialStores[]` and whether or not they're enabled. By default both snap & ceramic are enabled.

### setCredentialStore

#### Description

`setCredentialStore` changes the selected VC Store plugin.

#### Parameters

1. `store` - name of the VC Store plugin (`"snap"` or `"ceramic"`). Must be one of methods returned by `getAvailableCredentialStores`.
2. `value` - `boolean`. Enable/disable specific store plugins.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'setCredentialStore',
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

### getAvailableCredentialStores

#### Description

`getAvailableCredentialStores` gets a `string[]` list of supported VC Store plugins.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'getAvailableCredentialStores',
    },
  },
});
```

#### Returns

`strings[]`

## Snap Methods

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

We recommend calling this method in `window.ethereum.on('accountsChanged', handler: (accounts: Array<string>);`. See [Account Switching](/docs/integrate-masca/masca-connector.md#account-switching).

:::

### togglePopups

#### Description

`togglePopups` toggles popups that show up whenever the user tries to save a VC, generate a VP, etc. Popups are enabled by default to keep user in total control of their actions. With popups disabled, a dapp can query user's credentials, etc. without them knowing. We recommend using `addTrustedDapp` instead to only trust specific dapps.

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

### changePermission

#### Description

`changePermission` is used to change enable/disable popups for a specific RPC method (only `queryCredentials` is supported for now). Dapps (other than `masca.io`) can only change permissions for themselves. Note that `origin` needs to be a hostname (`masca.io`) and not a full URL (`https://masca.io`)

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'changePermission',
      params: {
        origin: 'masca.io',
        method: 'queryCredentials',
        value: true, // This disables popups
      },
    },
  },
});
```

### addTrustedDapp

#### Description

`addTrustedDapp` adds a dapp to the list of trusted dapps. Trusted dapps do not show popups. Dapps (other than `masca.io`) can only add themselves to the list of trusted dapps. Note that `origin` needs to be a hostname (`masca.io`) and not a full URL (`https://masca.io`)

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'addTrustedDapp',
      params: {
        origin: 'masca.io',
      },
    },
  },
});
```

### removeTrustedDapp

#### Description

`removeTrustedDapp` removes a dapp from trusted dapps. Dapps (other than `masca.io`) can only remove themselves from the list of trusted dapps. Note that `origin` needs to be a hostname (`masca.io`) and not a full URL (`https://masca.io`)

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'removeTrustedDapp',
      params: {
        origin: 'masca.io',
      },
    },
  },
});
```

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
    vcStore: Record<AvailableCredentialStores, boolean>;
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
    trustedDapps: string[];
  };
};
```

### setCeramicSession

#### Description

`setCeramicSession` sets the Ceramic session. As an Ethereum account handles storing and retrieving items from Ceramic, generating a session has to be done manually by a dapp. This is already handled in our Masca Connector. You can follow our [implementation in the connector](https://github.com/blockchain-lab-um/masca/blob/744b2e651dda15e7b44af894294692925c9a4964/packages/connector/src/utils.ts#L14) to implement this yourself.

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

`validateStoredCeramicSession` checks if there is an existing ceramic session set in Masca and if it's still valid. If this method returns `false`, the session must be set to use Ceramic!

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

### handleCredentialOffer

#### Description

`handleCredentialOffer` handles credential offers recieved from Polygon ID or OIDC issuers.

#### Parameters

1. `credentialOffer` - `string` (JSON string recieved from the issuer)

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'handleCredentialOffer',
      params: {
        credentialOffer: '...',
      },
    },
  },
});
```

#### Returns

`VerifiableCredential[]>`

### handleAuthorizationRequest

#### Description

`handleAuthorizationRequest` handles authorization requests recieved from Polygon ID or OIDC verifiers.

#### Parameters

1. `authorizationRequest` - `string` (JSON string recieved from the verifier)

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'handleAuthorizationRequest',
      params: {
        authorizationRequest: '...',
      },
    },
  },
});
```

### signData

#### Description

`signData` is used to sign JWTs and JWZs

#### Parameters

1. `type` - JWT | JWZ
2. `data` - JSON object based on selected type

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: snapId,
    request: {
      method: 'handleAuthorizationRequest',
      params: {
        type: 'JWT',
        data: {...}
      },
    },
  },
});
```
