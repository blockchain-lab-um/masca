## Verifiable Credentials Snap

### Idea

In its current form, MetaMask is unable to handle Verifiable Credentials. Adding VCs to MetaMask would unlock countless new use-cases, only limited by the creativity of developers.

We have taken upon ourselves a task to implement VC functionality into MetaMask, using the MetaMask Flask and Snaps. The Snap should be capable of securely storing multiple Verifiable Credentials and creating corresponding JWT Verifiable Presentations. Our initial idea was to limit VCs to a single MetaMask account. Because we want this Snap to be as flexible as possible, we decided that every MetaMask account should get a part of the storage to store VCs.

Our demo will use said Snap to store Solidity Course Completion VC that proves the user controlling the MetaMask account has completed a solidity course and is qualified to vote on Snapshot governance proposals.

### How it works?

Workflow of the Snap is simple. 

Before we can store VCs and generate VPs we have to prepare the VC Snap state. This includes requesting and storing the Encryption Public Key for a selected MetaMask account, which is used for encrypting sensitive data.

A VC provider issues a VC, which is encrypted and stored in the MetaMask state. When requested, the selected VC is used to generate and return a VP.

In order to maintain as much security as we can, we have decided not to expose private keys from existing MetaMask accounts but to use an additional Ethereum account, which will be exclusively used for generating Verifiable Presentations. This account will live in the MetaMask state and will only be required for generating VPs. Additionally, this account’s DID identifier has to be added as a delegate to the DID document of MetaMask’s account.


![VC Snap Architecture](https://i.imgur.com/aoaq5GL.png)

## Snap Architecture

////Explain difference between VC account and MM account

#### State Structure
As previously mentioned, VC Snap utilizes MetaMask's state to store information. 
Below are the interfaces used to store the information in the state. VCState is an object and it's parameters are initialized MetaMask account addresses. 
```
export interface VCState {
  [address: string]: VCAccount;
}

export interface VCAccount {
  encPubKey: string;
  encryptedVCData: string;
}

export interface VCData {
  pKey: string;
  address: string;
  vcs: Array<VerifiableCredential>;
}
```
If initialized, those properties store VCAccounts. VCAccount consists of Encryption Public Key, which is used to encrypt data and encrypted VCData. VCData is an object that consists of VC Account address, private keys and all VCs.

In practice MetaMask state would look something like this:

```
{
  ...,
  vcSnapState:
    {
      0xBea807A8...e59D:
        {
          encPubKey: 'Encryption Public Key string',
          encryptedVCData: 'Encrypted VC data string'
          // Decrypted VC Data
          //{
          //  pKey: Private Key string
          //  address: Address string
          //  vcs: [{VC Object}, {VC Object}, ...]
          //}
        },
      0x8Db2a08D...caD7: 
        {
          encPubKey: 'Encryption Public Key string',
          encryptedVCData: 'Encrypted VC data string'
        },
      ...,
    },
}
```

#### RPC Methods
Now that we understand what interfaces we use???... Let's look at the RPC methods implemented by VC Snap.

Every method requires a parameter with Ethereum address of selected MetaMask account. Some methods will require additional parameters like VC or VC_ID.

Methods `isInitialized` and `initialize` are used to check whether a property named `address` exists.

Method `getVCAddress` is used to get the address of the VC account for a specific `address`. This address is needed to create a DID delegate for the DID with identifier `did:ethr:rinkeby:address`. This should be handled by the dApp.

Method `saveVC` is used to save a VC for a specific `address`. Additional parameter `VC` is required.

Method `getVCs` is used to get a list of VCs for a specific `address`. This list is needed for the id of a selected VC. This id is needed to generate a VP.

Method `getVP` is used to get a VP for a specific VC for a specific `address`. Additional parameter `VC_ID` is needed. 

#### Encryption & Decryption

Sensitive information is encrypted using `@metamask/eth-sig-util`. It is encrypted using Encryption Public Key, which is provided by MetaMask, using the `eth_getEncryptionPublicKey` RPC method and providing selected `address` as parameter. This means, that the only way to decrypt this data is to use Ethereum's `eth_decrypt` RPC method. Both acctions must be confirmed by the user in a MetaMask prompt. Using Encryption we're able to store sensitive information in MetaMask state safely.


#### Verifiable Presentations JWT

All VCs used with this Snap must 'ne spomnim se besede' to the W3C Verifiable Credential Format (link).

As mentioned above, verifiable presentations are generated using a VC and VC Account. VP is generated using `did-jwt` library. VC Account is the signer of the VP. VP JWT must be validated by the dApp.
