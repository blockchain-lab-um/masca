## SSI Snap

The SSI Snap is a MetaMask Snap that enhances MetaMask with functionality to manage DIDs, VCs and VPs. SSI Snap uses DID:ETHR method.

## Snap Architecture

Veramo client powers the SSI Snap. It is used to manage DIDs and VCs, using Veramos DIDManager, KeyManager and PrivateKeyManager plugins and our custom <a href="https://github.com/blockchain-lab-um/veramo-vc-manager">VCManager plugin</a>. Currently, all data is stored in the MetaMask state, using custom data store plugins. Due to very extensible nature of these plugins we'll implement various other ways of storing data in the future, starting with cloud storing functionality, which should also make syncing between wallets possible. Users will get to configure how the data is stored.

In order to maintain as much security as possible, the private keys from MetaMask accounts are not exposed. An additional DID (new DID is generated for every MM account that wants to use VCs) is used instead. At the moment, these DIDs are used exclusively for generating VPs and need to be linked with a MetaMask accounts DID (added as a delegate to the DID document of a MetaMask account) for workflow to work properly.

![SSI Snap Architecture](https://i.imgur.com/YiAnoly.png)

#### State Structure

As previously mentioned, VC Snap utilizes MetaMask's state to store information.

MetaMask state structure:

```
{
  ...,
  SSISnapState:
    {
      0xBea807A8...e59D:
        {
          snapKeyStore: Record<string, IKey>,
          identifiers: Record<string, IIdentifier>,
          vcs: VerifiableCredential[]
        },
      0x8Db2a08D...caD7:
        {
          snapKeyStore: Record<string, IKey>,
          identifiers: Record<string, IIdentifier>,
          vcs: VerifiableCredential[]
        },
      ...,
    },
}
```

#### RPC Methods

Some methods require parameters.

Method `getDIDAddress` is used to get the newly generated DID for a MetaMask account. If this DID does not exist yet, it is generated. <i>This address is needed to add the newly generated DID as a delegate to the DID document of the currently selected MetaMask account. </i>

Method `saveVC` is used to save a VC in the state of the currently selected MetaMask account. Additional parameter `VC` is required.

Method `getVCs` is used to get a list of VCs from the state of the currently selected MetaMask account. <i> Currently, the only way to select a VC, for which you want to generate a VP, is through the dApp. This will change once MetaMask allows Snaps to implement custom UI elements and enable VC selection directly in MetaMask </i>

Method `getVP` is used to get a VP for a specific VC. Additional parameter `VC_ID` is needed.

### How to implement SSI Snap

1. dApp first calls the `getDIDAddress` RPC method to get a DID for the selected MetaMask account.
2. dApp then checks if the DID exists in the selected MetaMask account DID Document as a delegate, if not it should not proceed.
3. if dApp wants to issue a VC, it should call the `saveVC` RPC method with the VC provided as parameter.
4. if dApp wants to request a VP, it should call the `getVCs` RPC method, filter the needed VC and then call the `getVP` RPC method, with id of the selected VC provided, to request user to generate a VP for the selected VC.

#### Encryption & Decryption

Currently, data in the MetaMask state is unencrypted. This should change soon, as MetaMask Snaps is implementing encrypted storage ([PR](https://github.com/MetaMask/snaps-skunkworks/pull/369)).

#### Verifiable Presentations

Supports the same types of VPs as Veramo client.
