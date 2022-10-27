---
sidebar_position: 1
---

# How To Implement It?

The **SSI Snap** is a MetaMask Snap, that can handle **DIDs**, securely store **VCs**, create **VPs** and is designed to be blockchain-agnostic.

:::danger

Ceramic network and DID:KEY support are experimental and still under development!

:::

## Implementing the Snap in a dApp

### Using the SSI Snap Connector

`yarn add @blockchain-lab-um/ssi-snap-connector`

Connector has exposed function for installing the Snap.

After snap installation, this function returns `MetamaskSSISnap` object that can be used to retrieve snap API.
An example of initializing SSI snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const snap = await enableSSISnap({
  snapId: snapId,
  version: 'latest',
  supportedMethods: ['did:ethr', 'did:key'],
});
const api = await snap.getSSISnapApi();
```

SSI Snap Connector will take care of initializing the Snap for other DID methods (Needed to extract the public key) during the enableSSISnap function and whenever account changes.

`saveVC` is used to save a VC in the state of the currently selected MetaMask account. Additional parameter `VC` is required. VCs must adhere to the W3C Verifiable Credentials Recommendation. Invalid format might lead to failure when generating VPs. We recommend using Veramo to generate VCs with this [interface](https://veramo.io/docs/api/core.verifiablecredential).

```typescript
const res = await api.saveVC(verifiableCredential);
```

`getVCs` is used to get a list of VCs from the state of the currently selected MetaMask account. Optional property `query` is currently used to filter VCs with a subset of needed VC/VCs. Each VC returned by this function will include an additional property `key`, which is not a part of the actual "VC". This property is used as a key of dictionary where VCs are stored and **is required when generating a VP**!

_NOTE: Currently, the only way to select a VC, for which you want to generate a VP, is through the dApp. This will change once MetaMask allows Snaps to implement custom UI elements and enable VC selection directly in MetaMask_

_NOTE 2:_ _This will retrieve a list of VCs (or a single VC) stored under currently connected account._

```typescript
// Get a single VC or a list of VCs you're looking for
const vc = await api.getVCs({
  querry: {
    issuer: { id: 'did:ethr:0x04:0x123..' },
    credentialSubject: { id: 'did:ethr:0x04:0x321...' },
    credentialSchema: { id: 'https://beta.api.schemas.serto.id/...' },
  },
});
console.log('VC', vc);
//If vc is correct
const vc_id = vc.key;
```

`getVP` is used to get a VP for a specific VC. Parameter `VC_ID` is needed. `VC_ID` is a string and represents the id of a VC stored in SSI Snap state. This id is a string property `key` of every VC returned by the `getVCs` method!

`holder` of the VP will be a DID generated based on currently selected MetaMask account AND currently selected DID Method.

SSI Snap supports generating VPs using domain and challenge. It is recommended to use domain and challenge when generating and verifying VPs. To do so use additional parameters `domain` and `challenge`, however they are not required!

_NOTE: Currently, VPs can only contain a single VC. This will be changed in upcoming versions._

```typescript
// Get VP
const vp = await api.getVP(vc_id);
```

`switchMethod` is used to switch the currently selected DID method.

```typescript
await api.switchMethod('did:key');
```

`togglePopups` and `changeInfuraToken` are used to enable/disable "Are you sure?" alerts and to change the infuraToken.

```typescript
const res = await api.changeInfuraToken(infuraToken);

const res = await api.togglePopups();
```

_NOTE:_ _Snap can also be installed using a 3rd party Platform such as our [Platform](https://blockchain-lab-um.github.io/course-dapp/) or [Snaplist](https://snaplist.org/), or our [Configuration Page](../config)._

#### For a more detailed look at SSI Snap Connector visit its [documentation](../plugins/ssi-snap-connector)!

If you need more help with implementation feel free to contact us in Discord, or check the [DEMO Platform repo](https://github.com/blockchain-lab-um/course-dapp)!

### Working with VCs

It is up to the dApp to issue VCs and/or request VPs/VCs and verify their validity (scheme, subject, controller, content, etc.). We recommend using the [Veramo Framework](https://veramo.io/).
