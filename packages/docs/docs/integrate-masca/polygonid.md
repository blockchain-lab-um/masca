---
sidebar_position: 2
---

# Polygon ID

## Introduction

Masca supports Polygon ID protocol - receiving Verifiable Credentials from issuer nodes and presenting proofs to verifiers.

## Integration

For successfull management of requests involving receiving credentials and generating zkProofs, users must ensure they are operating on the same network as the issuer or verifier node from which they received the request.

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
