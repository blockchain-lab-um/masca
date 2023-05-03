---
sidebar_position: 3
---

# Snapshot (unofficial)

With our beliefs dictating that voting power should be earned, not bought, we integrated the Masca functionality to work with Snapshot — the most renowned DAO governance platform. With Snapshot, users owning an ENS domain can create their own space where the project’s proposals and governance live. Proposals can be made and voted on by anyone that conforms to the requirements (e.g., hold specific ERC20 tokens, present the required VP, etc.).

We implemented a DID plugin for Snapshot that enables the creation of proposals that use VPs as a voting mechanism. Only people with credentials that meet the requirements defined by the proposal owner can vote. These requirements include the issuer and the schema of a VC. The creators set which issuer and schema are valid. For example, `bclabum.eth` wants to create a proposal regarding the future of Masca, where only people with a specific credential can vote. `bclabum.eth` defines the specific credential requirements by setting the issuer to `did:ethr:0x123…` and the schema to “https://beta.api.schemas.serto.id/v1/public/consen-sys-hackathon-2021-participant/1.0/json-schema.json".

By moving from counting the voting power based on the number of tokens to an SSI-based approach, we establish a meritocratic system where the power cannot be bought. VCs are non-transferrable and bound to the user’s DID, stored locally in a wallet (or somewhere else if user decides). Of course, this example works with a “dummy” credential, but in a real-world setting, VC should be hard to obtain (e.g., diploma).

You can find the working demo [here](https://bclabum.informatika.uni-mb.si/snapshot/#/bclabum.eth).

<center>

[![YouTube Video](https://img.youtube.com/vi/Pz1M2a-LsXw/0.jpg)](https://www.youtube.com/watch?v=Pz1M2a-LsXw)

[YouTube video](https://www.youtube.com/watch?v=Pz1M2a-LsXw)

</center>

You can read more about the Snapshot integration in the [blog post](https://medium.com/@blockchainlabum/its-time-to-prove-your-worth-in-dao-ssi-using-metamask-snaps-part-2-3-17eb98678054).
