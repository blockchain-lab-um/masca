---
sidebar_position: 3
---

# OpenID for Verifiable Credentials

## Introduction

Masca offers comprehensive support for OpenID for Verifiable Credentials [specifications](https://openid.net/sg/openid4vc/specifications/). Masca streamlines the process of receiving credentials from compliant issuers and seamlessly sharing presentations with compliant verifiers. The specifications include a concept called Profiles, which are predefined ways to adapt to different Credential formats using specific extension points. Masca supports the EBSI profile, which was rigorously tested using their [conformance testing service](https://api-conformance.ebsi.eu/docs/wallet-conformance/holder-wallet). Looking ahead, our roadmap involves expanding our capabilities to encompass emerging profiles as we closely monitor the [OpenID Connect Working group](https://openid.net/wg/digital-credentials-protocols/). We're eagerly anticipating the delivery of a comprehensive conformance test suite from this group to further validate and enhance our software's compatibility and interoperability.

Additionally, it's important to note that the OID4VC specifications heavily rely on redirects, which Masca cannot accommodate. This might cause certain flows to not function as expected. We're currently exploring solutions to address this challenge. One such solution already in place involves using a proxy to redirect some requests, instead of calling the issuers and verifiers directly.

## Integration

### Handling of credential offers

This part handles credential offers, which are recieved from issuers.

```typescript
// The credential offer recieved from an issuer
// The credential offer is a URI string
// Here is an example credential offer from the EBSI conformance testing service
const credentialOffer: string =
  'openid-credential-offer://?credential_offer_uri=https%3A%2F%2Fapi-conformance.ebsi.eu%2Fconformance%2Fv3%2Fissuer-mock%2Foffers%2F6b9afdfe-69d1-4efd-aad0-da7249c07c8b';

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
// The authorization request recieved from a verifier
// The authorization request is a URI string
const authorizationRequest: string =
  'openid://?state=b17f79e3-8192-4fc5-a0a8-5e4c00adbab2&client_id=https%3A%2F%2Fapi-conformance.ebsi.eu%2Fconformance%2Fv3%2Fauth-mock&redirect_uri=https%3A%2F%2Fapi-conformance.ebsi.eu%2Fconformance%2Fv3%2Fauth-mock%2Fdirect_post&response_type=vp_token&response_mode=direct_post&scope=openid&nonce=24138beb-28e2-4096-b51c-bd2eaf27b034&presentation_definition=...';

const handleAuthorizationRequestResponse = api.handleAuthorizationRequest({
  authorizationRequest,
});

// Check if there was an error and handle it accordingly
if (isError(handleAuthorizationRequestResponse)) {...}
```
