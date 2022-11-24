---
sidebar_position: 3
---

# Verifiable Presentations (VP)

**Verifiable Presentation**, or **VP** for short, expresses data from one or more VCs and is packaged so that the authorship of the data is verifiable.

Essentially, VP is a way to verifiably present a Verifiable Credential. VP can contain one or more VCs and is signed using a DIDs.

The data in a VP, which is often about the same subject, could have been issued by multiple issuers. Let's say you must prove your University degree, past employment, and date of birth. This data usually originates from different entities, and the owner can combine them to create a single VP.

<center>
    
<img src="https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg" alt="VP" width="700" /><br />
    Example of the relationship between Verifiable Credentials and Derived Credentials in a Verifiable Presentation (<a href="https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg">image source</a>).

</center>

<br />

There is a lot of ongoing work on further enhancing data privacy when presenting VCs. We can do this with **Selective Disclosure** and **Zero-Knowledge Proofs** (ZKP). Selective disclosure enables generating proofs from **only a few attributes** of a credential. Using ZKPs, one could prove the necessary condition for the attribute **without revealing the actual value**. In practice, this means one could prove that they are above 18 without showing their ID card, and third parties would instantly be able to verify that data.
