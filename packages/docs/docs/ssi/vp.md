---
sidebar_position: 4
---

# Verifiable Presentation (VP)

**Verifiable Presentation**, or **VP** for short, expresses data from one or more VCs and is packaged so that the authorship of the data is verifiable. The data in a VP, which is often about the same subject, could have been issued by multiple issuers. Let's say you're required to prove your University degree, past employment, and date of birth. Each of these credentials is issued by a different entity, and the owner can combine them to create a single VP.

There is a lot of ongoing work on further enhancing data privacy when presenting VCs. This can be done with **Selective Disclosure** and **Zero-Knowledge Proofs** (ZKP). Selective disclosure enables generating proofs from **only a few attributes** of a credential. Using ZKPs, one could prove the necessary condition for the attribute **without revealing the actual value**. In practice, this means one could prove that they are above the age of 18 without showing their ID card, and third parties would instantly be able to verify that data.

![](https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg)

<center>
  Figure 1: Visual example of the relationship between Verifiable Credentials
  and Derived Credentials in a ZKP Presentation (
  <a href="https://www.w3.org/TR/vc-data-model/diagrams/zkp-cred-pres.svg">
    image source
  </a>
  )
</center>
