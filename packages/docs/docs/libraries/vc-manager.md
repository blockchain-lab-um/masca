---
sidebar_position: 4
---

# VCManager (Veramo)

:::danger

Ceramic network support is experimental and still under development!

:::

### Introduction

Veramo does not provide similar support for managing VCs like it does for DIDs and KeyPairs. **Veramo VC Manager** is a custom plugin for managing VCs with the Veramo client. It works very similarly to [DIDManager](https://github.com/uport-project/veramo/tree/next/packages/did-manager) and other Manager plugins built for Veramo. VCs stored using this plugin are stored in an array.

VCManager stores a Record of extended AbstractVCStore plugins, which makes storing different VCs on different platforms possible! Optionally, VCManager also has built in querying functionality which filters VCs and returns only a list of VCs that are a superset of provided query object (subset).

![VCManager design](https://i.imgur.com/UUf5NtO.png)

This plugin comes with an abstract class that can be extended in any form needed.

```js
export abstract class AbstractVCStore {
  abstract import(args: VerifiableCredential): Promise<boolean>
  abstract get(args: { id: string }): Promise<VerifiableCredential | null>
  abstract delete(args: { id: string }): Promise<boolean>
  abstract list(): Promise<VerifiableCredential[]>
}

```

This abstract class enabled [`SnapVCStore`](../ssi-snap/architecture.md) plugin, which stores the array of VCs in MetaMask State and `CeramicVCStore` which stores VCs on Ceramic Network.

### How to use

#### Veramo Agent Setup

Add the plugin to the Veramo agent setup.

```typescript
  const vcStorePlugins: Record<string, AbstractVCStore> = {};
  vcStorePlugins['snap'] = new SnapVCStore();
  vcStorePlugins['ceramic'] = new CeramicVCStore();
  vcStorePlugins['memory'] = new MemoryVCStore();
  export const agent = createAgent<
      ...
      IVCManager &
      ...
  >({
    plugins: [
      ...
      new VCManager({ store: vcStorePlugins }),
      ...
    ],
  });
```

Use the plugin

```typescript
await agent.saveVC({ store: 'snap', vc });
await agent.saveVC({ store: 'ceramic', vc });
const res = await agent.getVCs({
  store: 'ceramic',
  query: { credentialSubject: { id: 'did:ethr:0x04:0x123...321' } },
});
```

#### VCManager Functions

Get a specific VC from selected store

`agent.getVC({store: vcStore, id: vc_id})`

Save a VC to selected store

`agent.saveVC({store: vcStore, vc: vc})`

Delete a VC from selected store

`agent.deleteVC({store: vcStore, id: vc_id})`

Get an array of all VCs from selected store

`agent.listVCS({store: vcStore, query: VCQuery})`

VCQuery is an object that is a subset of VerifiableCredential. If provided, the function will only return VCs that match the VCQuerry subset. For example if you only want to retrieve VCs issued by a specific DID to a specific subject you would need to use

`agent.listVCS({query: {issuer: {id: 'did:ethr:0x...'}, credentialSubject: {id: 'did:ethr:0x...'}}})`

**[GitHub](https://github.com/blockchain-lab-um/veramo-vc-manager) |
[npm](https://www.npmjs.com/package/@blockchain-lab-um/veramo-vc-manager)**
