---
sidebar_position: 2
---

# Verifiable Credentials (VC)

**Verifiable Credentials** ([W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)), or **VCs** for short, are an open standard for digital credentials. They are digitally signed and can be verified cryptographically, which makes them tamper-proof. VCs also work well with data privacy, which goes in hand with data regulations pushed by the European Union (GDPR) and some other countries.

<center>
    
<img src="https://w3c.github.io/vc-data-model/WD/2018-07-18/diagrams/credential.svg" alt="VC" width="500" /><br />
    The structure of VC (<a href="https://w3c.github.io/vc-data-model/WD/2018-07-18/diagrams/credential.svg">image source</a>).

</center>

<br />

VCs are interoperable and can use **[JSON-LD](https://json-ld.org/)** (JSON for Linked Data). It is an extension of an already successful JSON format that provides a way to include object and data typing, JSON-LD keyword aliasing, creating links via nesting or referencing, and internationalization features (describes how to express data values in different languages). Another popular format for VCs is **[JWT](https://www.rfc-editor.org/rfc/rfc7519)** (JSON Web Token), a standardized internet format for transferring data with digital signatures. Because of that, current tools often provide better support for JWTs.
