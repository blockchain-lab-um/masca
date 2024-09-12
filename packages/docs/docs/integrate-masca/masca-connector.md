---
sidebar_position: 4
---

# Using Masca connector SDK

## Account Switching

Account switching must be handled by the dapp! This is required for Masca to work properly. Without appropriately calling this method, switching Accounts in MetaMask will NOT result in switching accounts in Masca! We recommend using the `window.ethereum.on('accountsChanged', handler: (accounts: Array<string>);`. More on this can be found [here](https://docs.metamask.io/wallet/reference/provider-api/#accountschanged).

```typescript
// When account changes in dapp
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

## Save VC

`saveCredential` is used to save a VC under the currently selected MetaMask account. Parameter `vc` is a `W3CVerifiableCredential` VC. Invalid format might lead to failure when generating VPs. We recommend using Veramo to generate VCs with this [interface](https://veramo.io/docs/api/core.verifiablecredential). Optional parameter `options` defines where the VC will get saved. VC can be stored in one or more places at the same time.

```typescript
const res = await api.saveCredential(verifiableCredential, {
  store: ['ceramic', 'snap'],
});
```

## Query VCs

`queryCredentials` is used to get a list of VCs stored by the currently selected MetaMask account. Optional parameter `params` is an object with optional properties `filter` and `options`.

Filter defines what `queryCredentials` returns and Options defines where to search for data and what format to return it in.

QueryCredentialsRequestParams type:

```typescript
type QueryCredentialsRequestParams = {
  filter?: {
    type: string;
    filter: unknown;
  };
  options?: {
    store?: AvailableCredentialStores | AvailableCredentialStores[];
    returnStore?: boolean;
  };
};
```

Currently, 3 different `filter` types are supported; `none`, `id`, and `JSONPath`. Type `none` will work as if no filter property was provided, `id` will search for matching ID of VC and `JSONPath` will use [ `jsonpath` ](https://www.npmjs.com/package/jsonpath) lib to find matching VCs.

In the case of `id`, `filter.filter` is a string of an id.

In the case of `JSONPath`, `filter.filter` is a string containing JSONPath string.

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
const vcs = await api.queryCredentials({
  filter: {
    type: id,
    filter: '123456',
  },
  options: {
    returnStore: true,
  },
});

console.log('VCs', vcs.data);

// To get all VCs
const vcs = await api.queryCredentials();
```

## Create VP

`createPresentation` is used to get a VP for one or more specific VCs. Params object is of type:

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
```

`vcs` is a list of VCs of type `W3CVerifiableCredential`.

`proofFormat` can be `jwt`, `jsonld` or `EthereumEip712Signature2021`.

`options` is optional and is used to define `domain`, `type` and `challenge` if needed.

`holder` of the VP will be a DID generated based on currently selected MetaMask account **AND** currently selected DID Method.

```typescript
// Get VP
const vp = await api.createPresentation({
  vcs: [verifiableCredentialObject],
  proofFormat: 'jwt',
  options: {
    challenge: '123456789',
  },
});
```

## Create VC

`createCredential` is used to return a VC created from the provided payload. This VC can be optionally stored in Masca.

```typescript
const payload: MinimalUnsignedCredential = {
  type: ['VerifiableCredential', 'Test Certificate'],
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

const res = await api.createCredential({
  minimalUnsignedCredential: payload,
  proofFormat: 'jwt',
  options: {
    save: 'true',
    store: ['snap'],
  },
});
```

`minimalUnsignedCredential` is a minimal object which is used to create a VC. It needs to contain at least `credentialSubject`, `type` & `@context`.

`proofFormat` is used to specify which proof format is used to sign the VC. `options` allow dapps to specify whether they want and where they want to store the VC.

## Delete VC

`deleteCredential` is used to delete a VC from one or more stores

`id` - id of VC

`options` is optional and is used to select a store where to delete VC from.

```typescript
const res = await api.deleteCredential('123', { store: 'snap' });
```

## DIDs

`getDID` and `getSelectedMethod` are used to get current did and currently selected did method.

```typescript
const res = await api.getDID();

const res = await api.getSelectedMethod();
```

## Supported DID Methods and VC Stores

`getAvailableCredentialStores` and `getAvailableMethods` are used to get all supported methods and vcstores

```typescript
const supportedMethods = await api.getAvailableMethods();

const supportedStores = await api.getAvailableCredentialStores();
```

## Switch DID Method

`switchDIDMethod` is used to switch the currently selected DID method.

```typescript
await api.switchDIDMethod('did:key');
```

## Configure VC Stores

`setCredentialStore` is used to enable/disable a specific VC store. By default both snap & ceramic are enabled!

```typescript
const res = await api.setCredentialStore('ceramic', false);
```

## Resolve DID

`resolveDID` is used to resolve a specified DID and returns `DIDResolutionResult` which contains DID Document, if the resolution is successful.

```typescript
const didRes = await api.resolveDID('did:ethr:0x01:0x123...4567');
```

## Verify Data

`verifyData` is used to verify a VC or a VP in Masca.

By default, this RPC method only returns a boolean. This can be changed by setting `verbose` to true, which changes the return type Veramo's `IVerifyResult` object.

```typescript
const vcRes = await api.verifyData({ credential: VC, verbose: true });
// OR
const vpRes = await api.verifyData({ presentation: VP, verbose: true });
```

## Snap Settings

`togglePopups` is used to enable/disable the `"Are you sure?"` alerts on any dapp. Popups are enabled by default for user to approve every action.

`addTrustedDapp` is used to add a dapp to the list of trusted dapps. Popups do not appear on trusted dapps. This method can be called to add ANY dapp ONLY ON `masca.io`. On any other dapp origin is set automatically (You can only add dapp X on dapp X). Input is a hostname of a dapp

`removeTrustedDapp` is used to remove a dapp from the list of trusted dapps. This method can only remove dapps with the same origin (dApp X can only remove dapp X). Input is a hostname of a dapp

`changePermission` is used to change permissions for a specific RPC method on a specific dapp. This will enable/disable popups for said method on said dapp.

`getSnapSettings` and `getAccountSettings` are used to retrieve global settings and settings for currently selected account. Inputs are hostname of a dapp, RPC method and boolean value to disable (`true`)/enable (`false`) popups.

Note that above methods require hostname (`masca.io`) and not full URL (`https://masca.io`) to work. Using full URL will result in error.

```typescript
const res = await api.togglePopups();

const res = await api.addTrustedDapp('masca.io');

const res = await api.removeTrustedDapp("masca.io");

const res = await api.changePermission("masca.io", 'queryCredentials', true) // This will disable popups for queryCredentials on masca.io
```

```typescript
const res = await api.getSnapSettings();

const res = await api.getAccountSettings();
```

## Sign data

`signData` is used to sign JWTs and JWZs

```typescript
// JWT
const res = await api.signData({
  type: 'JWT',
  data: {
    header: {...}
    payload: {...}
  }
});

// JWZ
const res = await api.signData({
  type: 'JWZ',
  data: {...} // Valid JSONObject
});
```

## Credential Exchange

`handleAuthorizationRequest` is

`handleCredentialOffer` is

```typescript

const res = await api.handleAuthorizationRequest({credentialOffer: '...'})

const res = await api.handleCredentialOffer({authorizationRequest: '...'})
```

## State Backup

State can be exported and imported using methods `exportStateBackup` and `importStateBackup`

```typescript

const res = await api.exportStateBackup()

const res = await api.importStateBackup({serializedState: '...'})

```

## Working with VCs

It is up to the dapp to issue VCs and/or request VPs/VCs and verify their validity (scheme, subject, controller, content, etc.). We recommend using the [Veramo Framework](https://veramo.io/).
