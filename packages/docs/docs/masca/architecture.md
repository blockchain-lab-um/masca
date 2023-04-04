---
sidebar_position: 4
---

# Architecture

As already mentioned, Masca is a MetaMask Snap extension. MetaMask Snaps is a system that allows anyone to expand the capabilities of MetaMask safely. This ranges from adding support for other non-EVM blockchains to managing online identity. You can learn more about MetaMask Snaps in [this section](./snaps.md).

![Masca Architecture](https://i.imgur.com/YiAnoly.png)

<center> Figure 1: Masca Architecture </center>
<br />

## Veramo Client

Veramo client powers the Masca. Inside Masca, Veramo Client is used to manage DIDs and VCs, using Veramos **DIDManager**, **KeyManager** and **PrivateKeyManager** plugins and our custom **[DataManager plugin](../libraries/data-manager)**.

**DIDManager**, **KeyManager**, **PrivateKeyManager** and **[DataManager](../libraries/data-manager)** plugins take care of managing and storing data. They all come with an abstract data-store class, e.g. [AbstractDataStore](https://github.com/blockchain-lab-um/ssi-snap/blob/master/packages/vcmanager/src/data-store/abstractDataStore.ts). Using said class, we implemented custom data-store plugins, that save data inside the MetaMask state or on the Ceramic Network.

These abstract classes make implementing different ways of storing data easy.

In the future, users will get to choose between different DataStore plugins (cloud, other apps, etc.).

Additionally to storing data, Veramo also handles creation of **Verifiable Presentations** **ICredentialIssuer** is a plugin used to create a VP using one or more VCs with the selected proof format.

**If you're interested in how VCs and VPs are generated and how Veramo and its plugins work visit their [documentation](https://veramo.io/docs/basics/introduction)!**
