---
sidebar_position: 3
---

# Verifiable Presentations (VP)

**Verifiable Presentations**, or **VPs** for short, express data from one or more VCs and are packaged so that the authorship of the data is verifiable.

Essentially, VPs are a way to verifiably present some or all data from one or more Verifiable Credentials. VPs can contain one or more VCs and are signed using a DID.

The data in a VP, which is often about the same subject, could have been issued by multiple issuers. Let's say you must prove your University degree, past employment, and date of birth. This data usually originates from different entities, and the owner can combine them to create a single VP.

<center>

![VP](https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg)

Example of the relationship between Verifiable and Derived Credentials in a Verifiable Presentation ([image source](https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg)).

</center>

There is much ongoing work on further enhancing data privacy when presenting VCs. We can do this with **Selective Disclosure** and **Zero-Knowledge Proofs** (ZKP). Selective disclosure enables generating proofs from **only a few attributes** of a credential. With ZKPs, one could prove the necessary condition for the attribute **without revealing the actual value**. In practice, one could prove they are above 18 years old without showing their ID card, and third parties could instantly verify that data.
