---
sidebar_position: 1
---

# How To Implement It?

**Masca** is a MetaMask Snap, that can handle **DIDs**, securely store **VCs**, create **VPs** and is designed to be blockchain-agnostic.

:::danger BE CAREFUL!

Ceramic Network support is experimental and still under development!

:::

## Integrating Masca into a dApp

### Using the Masca Connector

```bash
pnpm add @blockchain-lab-um/masca-connector
```

Connector has an exposed function for installing the Masca snap. For ease of use, the connector package also exposes all the functions and types from `@blockchain-lab-um/masca-types` and `@blockchain-lab-um/utils` NPM packages.

After Masca installation, this function returns a `Masca` object that can be used to retrieve Masca API.
An example of initializing Masca and invoking Masca's API is shown below.

For Masca to work properly, it needs to know the address of the connected account. Initially this can be done by passing the address as a parameter to `enableMasca` function. Later, the address can be changed using the `setCurrentAccount` RPC method!

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Install snap and fetch the Masca API
const masca = await enableMasca(address, {
  snapId: snapId,
  version: 'latest',
  supportedMethods: ['did:ethr', 'did:key'],
});

// Check if the RPC method failed
if(isError(masca)) {
  console.error(setAccountRes.error);
  return;
}

const api = await masca.data.getMascaApi();
```

Every RPC call will return an object that can be Success or Error. More on error handling can be found [here](./../masca/architecture).

Masca Connector will take care of initializing Masca for other DID methods (needed to extract the public key) during the enableMasca function.

#### Jump [here](../libraries/masca-connector) for a more detailed look at Masca Connector!

### Account Switching

Account switching must be handled by the dApp! This is required for Masca to work properly. Without approprietly calling this method, switching Accounts in MetaMask will NOT result in switching accounts in Masca! We recommend using the `window.ethereum.on('accountsChanged', handler: (accounts: Array<string>);` . More on this can be found [here](https://docs.metamask.io/wallet/reference/provider-api/#accountschanged).

```typescript
// When account changes in dApp
window.ethereum.on('accountsChanged', (...accounts) => {
  const setAccountRes = await api.setCurrentAccount({
    currentAccount: (accounts[0] as string[])[0],
  });

  if (isError(setAccountRes)) {
    console.error(setAccountRes.error);
    return;
  }
});

```

### Save VC

`saveVC` is used to save a VC under the currently selected MetaMask account. Parameter `vc` is a `W3CVerifiableCredential` VC. Invalid format might lead to failure when generating VPs. We recommend using Veramo to generate VCs with this [interface](https://veramo.io/docs/api/core.verifiablecredential). Optional parameter `options` defines where the VC will get saved. VC can be stored in one or more places at the same time.

```typescript
const res = await api.saveVC(verifiableCredential, {
  store: ['ceramic', 'snap'],
});
```

### Query VCs

`queryVCs` is used to get a list of VCs stored by the currently selected MetaMask account. Optional parameter `params` is an object with optional properties `filter` and `options` .

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

Currently, 3 different `filter` types are supported; `none` , `id` , and `JSONPath` . Type `none` will work as if no filter property was provided, `id` will search for matching ID of VC and `JSONPath` will use [ `jsonpath` ](https://www.npmjs.com/package/jsonpath) lib to find matching VCs.

In the case of `id` , `filter.filter` is a string of an id.

In the case of `JSONPath` , `filter.filter` is a string containing JSONPath string.

:::info Note

The query needs to start with @.data while filtering VC alone.

:::

A JSONPath example:

```typescript
const jsonPath =
  '$[?(@.data.credentialSubject.achievement == "Certified Solidity Developer 2")]';
```

Options defines where to search for VCs. One or more supported stores can be provided. If `returnStore` is enabled, metadata of returned VCs will contain a string where they're stored.

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

console.log('VCs', vcs.data);

// To return every VC
const vcs = await api.queryVCs();
```

### Create VP

`createVP` is used to get a VP for one or more specific VCs. Params object is of type:

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
```

`vcs` is a list of VCs of type `W3CVerifiableCredential` .

`proofFormat` can be `jwt` , `jsonld` or `EthereumEip712Signature2021` .

`options` is optional and is used to define `domain` , `type` and `challenge` if needed.

`holder` of the VP will be a DID generated based on currently selected MetaMask account **AND** currently selected DID Method.

```typescript
// Get VP
const vp = await api.createVP({
  vcs: [verifiableCredentialObject],
  proofFormat: 'jwt',
  options: {
    challenge: '123456789',
  },
});
```

### Create VC

`createVC` is used to return a VC created from the provided payload. This VC can be optionally stored in Masca.

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

const res = await api.createVC({
  minimalUnsignedCredential: payload,
  proofFormat: 'jwt',
  options: {
    save: 'true',
    store: ['snap'],
  },
});
```

`minimalUnsignedCredential` is a minimal object which is used to create a VC. It needs to contain at least `credentialSubject` , `type` & `@context` .

`proofFormat` is used to specify which proof format is used to sign the VC. `options` allow dApps to specify whether they want and where they want to store the VC.

### Delete VC

`deleteVC` is used to delete a VC from one or more stores

`id` - id of VC

`options` is optional and is used to select a store where to delete VC from.

```typescript
const res = await api.deleteVC('123', { store: 'snap' });
```

### DIDs

`getDID` and `getSelectedMethod` are used to get current did and currently selected did method.

```typescript
const res = await api.getDID();

const res = await api.getSelectedMethod();
```

### Supported DID Methods and VC Stores

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

`setVCStore` is used to enable/disable a specific VC store. By default both snap & ceramic are enabled!

```typescript
const res = await api.setVCStore('ceramic', false);
```

### Resolve DID

`resolveDID` is used to resolve a specified DID and returns `DIDResolutionResult` which contains DID Document, if the resolution is successful.

```typescript
const didRes = await api.resolveDID('did:ethr:0x01:0x123...4567');
```

### Verify Data

`verifyData` is used to verify a VC or a VP in Masca.

By default, this RPC method only returns a boolean. This can be changed by setting `verbose` to true, which changes the return type Veramo's `IVerifyResult` object.

```typescript
const vcRes = await api.verifyData({ credential: VC, verbose: true });
// OR
const vpRes = await api.verifyData({ presentation: VP, verbose: true });
```

### Snap Settings

`togglePopups` is used to enable/disable the `"Are you sure?"` alerts.

`getSnapSettings` and `getAccountSettings` are used to retrieve global settings and settings for currently selected account.

```typescript
const res = await api.togglePopups();
```

```typescript
const res = await api.getSnapSettings();

const res = await api.getAccountSettings();

```

### Handle Credential Offer

`handleCredentialOffer` is used to handle either Polygon ID or OIDC credentials offers

Successful response includes `VerifiableCredential[]`

**Important:** The credential offer must be handled by the user on the correct network and with the correct did method selected.

```typescript
const res = await api.handleCredentialOffer({
  credentialOffer: data, // request in string format
});

if (isSuccess(res)) {
  // Here you can loop through the received credentials and save them
  const recievedCredentials = res.data;

  // Loop credentials
  for (const credential of recievedCredentials) {
    const saveCredentialResult = await api.saveVC(credential, {
      store: 'snap',
    });
  }
}
```

### Handle Authorization Request

`handleAuthorizationRequest` is used to handle either Polygon ID or OIDC authorization requests

**Important:** The authorization request must be handled by the user on the correct network and with the correct did method selected.

```typescript
const res = await api.handleAuthorizationRequest({
  authorizationRequest: data, // request in string format
});
```

### Working with VCs

It is up to the dApp to issue VCs and/or request VPs/VCs and verify their validity (scheme, subject, controller, content, etc.). We recommend using the [Veramo Framework](https://veramo.io/).
