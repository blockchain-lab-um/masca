---
sidebar_position: 5
---

# Storage

SSI Snap utilizes MetaMask's state to store data. SSI Snap modifies the **`SSISnapState`** object.

In the `SSISnapState` object, data for every MetaMask account is stored in property, named after the said MetaMask account. Inside this property Keypairs, DIDs, VCs and Account Configuration are stored.

There is also global configuration object in the SSISnapState object

Data-store plugins, used by Veramo Client and Manager plugins, modify the state.

- `KeyStoreManager`
- `PrivateKeyManager`
- `DIDManager`
- `VCManager`

It is important to note that MetaMask Account private keys are **NEVER** exported from MetaMask!

Structure of the state stored in MetaMask:

```typescript
{
  SSISnapState:
    {
      SSISnapConfig:
      {
        snap: {
          infuraToken: string;
          acceptedTerms: boolean;
          ...
        };
        dApp: {
          disablePopups: boolean;
          ...
        };
      }
      0xBea807A8...e59D:
        {
          snapKeyStore: Record<string, IKey>,
          snapPrivateKeyStore: Record<string, IKey>,
          identifiers: Record<string, IIdentifier>,
          vcs: Record<string, VerifiableCredential>
          publicKey: string;
          accountConfig: {
            ssi:
              {
                didMethod: "did:ethr",
                vcStore: "snap"
              }
          }
        },
      0x8Db2a08D...caD7:
        {
          snapKeyStore: Record<string, IKey>,
          snapPrivateKeyStore: Record<string, IKey>,
          identifiers: Record<string, IIdentifier>,
          vcs: Record<string, VerifiableCredential>
          publicKey: string;
          accountConfig: {
            ssi:
              {
                didMethod: "did:key",
                vcStore: "ceramic"
              }
          }
        },
      ...,
    },
}
```
