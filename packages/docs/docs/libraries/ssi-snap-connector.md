---
sidebar_position: 1
---

# SSI Snap Connector

SSI Snap connector is used to install SSI snap and expose API toward snap on dApps and other applications.

For more details on SSI Snap Connector itself see [ssi-snap-connector repo](https://github.com/blockchain-lab-um/ssi-snap-connector).

:::danger

Ceramic network and DID:KEY support are experimental and still under development!

:::

## Usage

### Install

`yarn add @blockchain-lab-um/ssi-snap-connector`

Connector has exposed function for installing the Snap.

```typescript
export async function enableSSISnap(
  {
    snapId?: string;
    version?: string;
    supportedMethods?: Array<typeof availableMethods[number]>;
  }): Promise<MetaMaskSSISnap>;
```

When installing the SSI Snap it is possible to set a custom `snapId` if you do not want to instal it from the official repository.

It is also possible to use custom version and set a list of supported methods. If connected SSI Snap does not currently have one of the supported methods selected, `switchMethod` RPC method will be automatically called.

During the `enableSSISnap` function `init` RPC method is called. If user changes MetaMask Account, the same function will be called again (nothing will happen if user already accepted Terms & Conditions on new Account).

After snap installation, this function returns `MetamaskSSISnap` object that can be used to retrieve snap API.
An example of initializing SSI snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const snap = await enableSSISnap({ version: 'latest' });
const api = await snap.getSSISnapApi();

// invoke API
const vcs = await api.getVCs();

console.log('list of VCs:', vcs);
```

## Connector methods:

```typescript
/**
 * Get a list of VCs stored in the SSI Snap under currently selected MetaMask account
 *
 * @param {VCQuerry} querry - Querry for filtering through all VCs
 * @return {Promise<Array<VerifiableCredential>>} list of VCs
 */
const vcs = await api.getVCs({ issuer: 'did:0x04:0x123...' });

/**
 * Get a VP from a VC
 *
 * @param {string} vc_id - ID of VC used for generating a VP. Can be obtained with getVCs function
 * optional @param {string} challenge
 * optional @param {string} domain
 */
const vp = await api.getVP(vc_id);

/**
 * Save a VC in the SSI Snap under currently selected MetaMask account
 *
 * @param {VerifiableCredential} verifiableCredential - vc
 *
 */
const res = await api.saveVC(verifiableCredential);

/**
 * Initialize MetaMask snap for an account
 *
 */
const res = await api.init();
/**
 * Get DID generated using currently selected MM account and currently selected DID method.
 * @returns {string} - did
 */
const did = await api.getDID();
/**
 * Get currently selected DID Method
 *
 * @returns {string} - did method
 */
const method = await api.getMethod();
/**
 * Get a list of supported DID methods
 *
 * @returns {Array<string>} - supported DID methods
 */
const methods = await api.getAvailableMethods();
/**
 * Switch DID method to one of supported DID methods
 *
 * @param {string} - new DID method name
 */
const res = await api.switchMethod(didMethod);
/**
 * Get currently selected VC Store plugin
 *
 * @returns {string} - name of VC Store plugin
 */
const vcStore = await api.getVCStore();
/**
 * Get a list supported VC Store plugins
 *
 * @returns {Array<string>} - supported VC Store plugins
 */
const vcStores = await api.getAvailableVCStores();
/**
 * Set VC Store plugin
 *
 * @param {string} - name of VC Store plugin
 */
const res = await api.setVCStore(vcStore);

/**
 * Toggle popups - enable/disable "Are you sure?" confirmation windows when retrieving VCs and generating VPs,...
 *
 */
const res = await api.togglePopups();

/**
 * Change infura token
 *
 * @param {string} infuraToken
 *
 */
const res = await api.changeInfuraToken(infuraToken);

/**
 *  Get settings for Snap & currently selected account
 */
const snapSettings = await api.getSnapSettings();

const accountSettings = await api.getAccountSettings();
```

#### Utility methods

SSI Snap Connector also comes with additional utility methods such as `isSnapInstalled`, `isMetamaskSnapsSupported` and `hasMetamask`.
