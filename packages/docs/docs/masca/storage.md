---
sidebar_position: 5
---

# Storage

Masca utilizes MetaMask's state to store data. Masca modifies the **`MascaState`** object.

In the `MascaState` object, we store the data for every MetaMask account in a property named after the specific MetaMask account. Inside this property DIDs, VCs, Snap & Account Configuration are stored.

There is also a global configuration object in the MascaState object

Data-store plugins, used by Veramo Client and Manager plugins, modify the state.

- `DIDManager`
- `DataManager`

:::tip Private Keys

It is important to note that we **NEVER** export MetaMask Account private keys! They are only used during RPC calls and are deleted from memory after the RPC method finishes with the execution!

:::

Structure of the state stored in MetaMask:

```typescript
{
  MascaState:
    {
      MascaConfig:
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
          identifiers: Record<string, IIdentifier>,
          vcs: Record<string, VerifiableCredential>
          publicKey: string;
          accountConfig: {
            ssi:
              {
                didMethod: "did:ethr",
                vcStore: {
                  snap: true,
                  ceramic: true
                }
              }
          }
        },
      0x8Db2a08D...caD7:
        {
          identifiers: Record<string, IIdentifier>,
          vcs: Record<string, VerifiableCredential>
          publicKey: string;
          accountConfig: {
            ssi:
              {
                didMethod: "did:key",
                vcStore: vcStore: {
                  snap: true,
                  ceramic: false
                }
              }
          }
        },
      ...,
    },
}
```
