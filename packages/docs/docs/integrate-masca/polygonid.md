---
sidebar_position: 2
---

# Polygon ID

## Introduction

Masca supports both did:polygonid and did:iden3. Both methods rely on the selected network, and for each network, a separate identity is created. When using did:polygonid with the Polygon mainnet, the DID of the identity will appear as follows: `did:polygonid:polygon:main:2q6KWUhghmPGRuh8GFMzDX3EYp1WVspWN9ZdQEk4D2`. Similarly, when using the Mumbai testnet, it will look like this: `did:polygonid:polygon:mumbai:2qHwZfDodaCtudtJuKTcswBbUw7DihT7Xi9vSCyC1r`. This means that each identity stores its credentials separately in Masca's storage. Understanding this concept is important before proceeding with other supported operations, such as receiving credentials from Polygon ID issuer nodes (_credential offer_) and authenticating at Polygon ID verifier nodes (_authorization request_).

## Integration

For successfull management of requests involving receiving credentials and generating zkProofs, users must ensure they are operating on the same network as the issuer or verifier node from which they received the request.

### General steps

The following are general steps that need to be carried out before continuing.

```typescript
import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

// Connect the user and get the address of his current account
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});
const address = accounts[0];

// Enable Masca
const enableResult = await enableMasca(address, {
  snapId: 'npm:@blockchain-lab-um/masca',
  version: '1.0.0',
  supportedMethods: ['did:polygonid'],
});

// Check if there was an error and handle it accordingly
if (isError(enableResult)) {...}

// Now get the Masca API object
const api = await enableResult.data.getMascaApi();
```

### Handling of credential offers

This part handles credential offers, which are recieved from Polygon ID issuers.

```typescript
// The credential offer recieved from a Polygon ID issuer
// The credential offer is a JSON string
const credentialOffer: string =
  '{"body":{"credentials":[{"description":"KYCAgeCredential","id":"348a8620-40fd-11ee-beda-0242ac1d0006"}],"url":"https://dev.polygonid.me/api/v1/agent"},"from":"did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy","id":"3a0fbba4-601c-4773-baca-0b8f0cfc7f43","thid":"3a0fbba4-601c-4773-baca-0b8f0cfc7f43","to":"did:polygonid:polygon:main:2q6KWUhghmPGRuh8GFMzDX3EYp1WVspWN9ZdQEk4D2","typ":"application/iden3comm-plain-json","type":"https://iden3-communication.io/credentials/1.0/offer"}';

const handleCredentialOfferResponse = api.handleCredentialOffer({
  credentialOffer,
});

// Check if there was an error and handle it accordingly
if (isError(handleCredentialOfferResponse)) {...}

// Recieved credentials
const recievedCredentials: VerifiableCredential[] = handleCredentialOfferResponse.data;

// Loop credentials and save them in Masca storage
for (const credential of recievedCredentials) {
  const saveCredentialResult = await api.saveCredential(credential, {
    store: 'snap',
  });
}
```

### Handling of authorization requests

This part handles authorization requests, which are recieved from Polygon ID verifiers.

```typescript
// The authorization request recieved from a Polygon ID verifier
// The authorization request is a JSON string
const authorizationRequest: string =
  '{"body":{"callbackUrl":"https://issuer-v2.polygonid.me/api/callback?sessionId=334944","reason":"test flow","scope":[]},"from":"did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy","id":"ea786170-f45f-4f13-b631-c4a7bbc03905","thid":"ea786170-f45f-4f13-b631-c4a7bbc03905","typ":"application/iden3comm-plain-json","type":"https://iden3-communication.io/authorization/1.0/request"}';

const handleAuthorizationRequestResponse = api.handleAuthorizationRequest({
  authorizationRequest,
});

// Check if there was an error and handle it accordingly
if (isError(handleAuthorizationRequestResponse)) {...}
```
