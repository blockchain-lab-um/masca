---
sidebar_position: 5
---

# VC Trust Model

SSI completely changes the paradigm of online data sharing and brings it closer to the physical world. There are three entities in the **VC trust model:**

- **Issuer** that issues the credential
- **Holder** that is the owner and subject of the credential
- **Verifier** that receives and verifies the credential

<center>

![VC Workflow](https://i.imgur.com/YjGAqsE.png) Figure 1: VC Workflow

</center>

As seen in the image above, the issuer is the entity that issues VC to the holder whom the VC is about. The holder then presents the VC to the verifier, who verifies the validity of the VC and checks if it meets the established criteria.

For example, a government issues an ID card in the form of a VC to Alice. Alice is the holder of the VC. Alice wants to buy alcohol at the local convenience store. Alice has to prove that she is 18+ and does so by presenting a VP, which she generates using her VC. The convenience store then verifies if Alices VC is valid and if she is indeed older than 18.

How can the convenience store verify the validity of the VC? It's simple. When the government issues a VC, they attach and sign the credential with their **Public DID**. The same Public DID is also registered on a blockchain. When the convenience store wants to verify the authenticity and validity of the VC and its proof, they can check the DID and its associated public key on the blockchain to see who issued it without contacting the issuing entity. DIDs enable VCs to be **verified anywhere, at any time**.

## Sounds great! But, how can we use VCs?

Unfortunately, there is no easy way to use and manage VCs. More or less, all current solutions require users to install an additional mobile application or use a specific yet another platform. These solutions are called SSI wallets and agents, e.g., Hyperleger Aries, Serto ... But this is a significant flaw in the user experience. Needing to use a different application or service might be a burden for most users who haven't come to grips with the most basic web3 applications and wallets. The question arises, is it possible to add support for DIDs and VCs to a massively adopted and easy-to-use wallet?
