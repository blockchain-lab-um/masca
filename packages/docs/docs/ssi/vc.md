---
sidebar_position: 3
---

# Verifiable Credentials (VC)

**Verifiable Credentials** ([W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)), or **VCs** for short, are an open standard for digital credentials to solve this issue. They are digitally signed and can be verified cryptographically, which makes them tamper-proof. VCs work well with data privacy, which goes well with data regulations pushed by the European Union (GDPR) and some other countries.

VCs are interoperable and can use **[JSON-LD](https://json-ld.org/)** (JSON for Linked Data). It is an extension of an already successful JSON format that provides a way to include object and data typing, JSON-LD keyword aliasing, creating links via nesting or referencing, and internationalization features (describes how to express data values in different languages). Another format for VCs is **[JWT](https://www.rfc-editor.org/rfc/rfc7519)** (JSON Web Token); popular internet format for transferring data with digital signatures. Because of that, current SSI tools often provide better support for JWTs.
