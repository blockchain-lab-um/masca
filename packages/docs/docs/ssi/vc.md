---
sidebar_position: 2
---

# Verifiable Credentials (VC)

**Verifiable Credentials** ([W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)), or **VCs** for short, are an open standard for digital, cryptographically verifiable credentials. They can be stored on digital devices, are digitally signed and can be verified cryptographically, which makes them tamper-proof. VCs work well with data privacy, which goes well with data regulations pushed by the European Union (GDPR) and some other countries.

VCs bring many benefits:

- **Instantly verifiable** - They can be verified anywhere at any time
- **Tamper-proof** - Cryptography assures their authenticity and enables users to store and share data securely
- **Independent from the issuer** - Instant verifiability makes them independent from the issuer. They can get verified anywhere, without the need of the issuer (e.g. an university) to confirm the authenticity
- **VC holders have full control and ownership of their data and privacy** - Users decide what gets shared and what doesn't
- **Portable** - Users can store VCs in their digital wallet (e.g. a mobile app) and use them anywhere

<center>

<img src="https://i.imgur.com/guqZBX9.png" />

[UI Example](https://identity.foundation/wallet-rendering/#term:display-mapping-object) of a VC

</center>

## Use cases for VCs

VCs have many different use cases. The most notable ones are:

- ID Card
- Degree
- Employment credential
- Certificates
- Documents
- Licenses
- And much, much more.

All the previously mentioned benefits make VCs the perfect solution for many problems. For example IDs, Documents, Licenses, etc. can be forged and dfficult to authenticate. Process of authentication is usually slow and prone to errors. Another issue is lack of control over data and lack of privacy. Another problem or risk is reliance on the issuer. If entity that provides credentials might not always be reachable and available (e.g. server failures, electricity outages, etc.) to authenticate credentials. All of mentioned issues/risks can be solved with VCs. This would affect many fields, ranging from Healthcare to Finance.

[Learn more...](https://www.w3.org/TR/vc-use-cases/)

## Structure of a VC

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "UniversityDegree"],
  "id": "feri:degree:17891",
  "issuer": "did:web:feri.um.si",
  "issuanceDate": "2022-11-20T15:11:22Z",
  "credentialSubject": {
    "id": "did:ethr:0x01:0x123",
    "studentId": "1023213981",
    "faculty": "FERI",
    "module": "Computer Science",
    "yearOfGraduation": "2022",
    "averageScore": "8.91",
    "name": "John Dough",
    "dateOfBirth": "2001-12-12",
    "placeOfBirth": "London",
    "currentAddress": "Street of London 13",
    "gender": "Male"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2022-11-20T15:11:22Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "https://feri.um.si/verifyDegree/keys/1",
    "proofValue": "bXN0IDI3JVV1aBUXfiwJJmZhe19TLTgxemI/P11yPGkvbXN0IDI3JVV1aBUXfiwJJmZhe19TLTgxemI/P11yPGkv"
  }
}
```

VC consists of multiple important parts:

#### [Type](https://www.w3.org/TR/vc-data-model/#types)

```json
{
  ...
  "type": ["VerifiableCredential", "UniversityDegree"],
  ...
}
```

Credential can have one or more types. Its types are defined in an array of strings. String `VerifiableCredential` is mandatory. Use case can be detirmined based on types of a VC. In this particular example, the string `UniversityDegree` tells us this VC serves as an Uni Degree and might be useful when applying for a job.

#### [Identifier](https://www.w3.org/TR/vc-data-model/#identifiers)

```json
{
  "id": "feri:degree:17891"
}
```

When expressing statements about a specific thing, such as a person, product, or organization, it is often useful to use some kind of identifier so that others can express statements about the same thing. The id property is intended to unambiguously refer to an object, such as a person, product, or organization.

#### [Issuer](https://www.w3.org/TR/vc-data-model/#issuer)

```json
{
  ...
  "issuer": "did:web:feri.um.si",
  ...
}
```

#### [Credential Subject](https://www.w3.org/TR/vc-data-model/#credential-subject)

```json
{
  ...
  "credentialSubject": {
    "id": "did:ethr:0x01:0x123",
    "degree": "Computer Science",
    "yearOfGraduation": "2022",
    "averageScore": "8.91",
    "name": "John Dough",
    "dateOfBirth": "2001-12-12",
    "placeOfBirth": "London",
    "currentAddress": "Street of London 13",
    "gender": "Male",
    ...
  },
  ...
}
```

The entity (e.g. a person, object or company) the credential data is about. This object contains one or more properties that are related to the subject of VC. The subject identifier (`credentialSubject.id`) is usually a DID of the entity. In our example, `credentialSubject` contanis relevant data (type of degre, year of graduation, score, etc.) for the University Degree of `John Dough`.

#### [Cryptographic Proofs](https://www.w3.org/TR/vc-data-model/#proofs-signatures)

```json
{
  ...
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2022-11-20T15:11:22Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "https://feri.um.si/verifyDegree/keys/1",
    "proofValue": "bXN0IDI3JVV1aBUXfiwJJmZhe19TLTgxemI/P11yPGkvbXN0IDI3JVV1aBUXfiwJJmZhe19TLTgxemI/P11yPGkv"
  }
  ...
}
```

One or more cryptographic proofs can be used to detect tampering and verify the authorship of a credential.

## Proof Formats

VCs are interoperable and can use **[JSON-LD](https://json-ld.org/)** (JSON for Linked Data). It is an extension of an already successful JSON format that provides a way to include object and data typing, JSON-LD keyword aliasing, creating links via nesting or referencing, and internationalization features (describes how to express data values in different languages). Another popular format for VCs is **[JWT](https://www.rfc-editor.org/rfc/rfc7519)** (JSON Web Token), a standardized internet format for transferring data with digital signatures. Because of that, current tools often provide better support for JWTs.
