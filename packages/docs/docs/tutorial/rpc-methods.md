---
sidebar_position: 5
---

# JSON-RPC API

## VC Methods

### saveVC

#### Description

Used to store the VC in SSI Snap, using currently selected VC Store plugin

#### Parameters

1. vc - The VC. Must conform to the VerifiableCredential standard

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'saveVC',
      params: {
        verifiableCredential: vc,
      },
    },
  ],
});
```

#### Returns

boolean if save was successful.

### getVCs

#### Description

Method used to retrieve a list of VCs. VCs returned using this method will include an additional property `key`, which can be used when generating, retrieving or deleting a VC.

#### Parameters

1. query (optional) - Object that is subset of the wanted VC object. Used to filter VCs and only return VCs that are a superset of the query

```typescript
const response = await ethereum.request({
          method: 'wallet_invokeSnap',
          params: [snapId, {
            method: 'getVCs',
            params: {query: {credentialSubject: {id: "did:ethr:0x04:0x123..321"}}}
          }]
```

#### Returns

array of VCs

### getVP

#### Description

Method used to generate a VP signed by DID (selected MetaMask account + selected DID method). If you want to change DID, use the `switchMethod` method and/or switch MetaMask account.

#### Parameters

1. vc_id - ID of the VC that is used to generate a VP. vc_id is equivalent to the `key` property of the VCs returned with `getVCs` method.
2. challenge (optional) - challenge used in VP generation
3. domain (optional) - domain used in VP generation

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'getVP',
      params: { vc_id: vc_id },
    },
  ],
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
  params: [
    snapId,
    {
      method: 'getDID',
    },
  ],
});
```

### getMethod

#### Description

Returns currently selected DID method

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'getMethod',
    },
  ],
});
```

### switchMethod

#### Description

Switch the DID method

#### Parameters

1. didMethod - name of did method ("did:ethr" or "did:key"). Must be one of methods returned by `getAvailableMethods`.

:::danger

DID:KEY support is experimental and still under development!

:::

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'switchMethod',
      params: { didMethod: method },
    },
  ],
});
```

### getAvailableMethods

#### Description

Returns a list of supported DID methods

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'getDID',
    },
  ],
});
```

## VC Store Methods

### getVCStore

#### Description

Get selected VC Store plugin

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'getVCStore',
    },
  ],
});
```

### setVCStore

#### Description

Change the selected VC Store plugin

#### Parameters

1. vcStore - name of VC Store plugin ("snap" or "ceramic"). Must be one of methods returned by `getAvailableVCStores`.

:::danger

Ceramic network support is experimental and still under development!

:::

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'setVCStore',
    },
  ],
});
```

#### Returns

### getAvailableVCStores

#### Description

Get a list of supported VC Store plugins

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'getAvailableVCStores',
    },
  ],
});
```

## Snap Methods

### init

#### Description

Used to familiarize the user with Risks, etc. and to get the accounts Public key, which is used to generate DIDs.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'init',
    },
  ],
});
```

### togglePopups

#### Description

Used to disable popups that show up whenever user tries to save a VC, generate a VP, etc.

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'togglePopups',
    },
  ],
});
```

### changeInfuraToken

#### Description

change the Infura token used by SSI Snap

#### Parameters

1. infuraToken - new infura token

```typescript
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: 'changeInfuraToken',
      params: { infuraToken: infuraToken },
    },
  ],
});
```

#### Returns

boolean
