---
sidebar_position: 1
---

# Decentralized Identifiers (DID)

**Decentralized Identifiers** ([W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/)), also **DIDs** are unique and persistent identifiers (URI) that enable verifiable and decentralized identity. They are entirely controlled by the identity owner and are independent of centralized authorities. Individuals can create as many DIDs as they wish and use each in different contexts to prevent data correlation.

**DID Document** forms the root record for a DID and is a set of data that describes a DID, including mechanisms, such as public keys and pseudonymous biometrics, that an entity can use to authenticate itself as the DID. While anyone can obtain a public key from the DID document, a private key used for proofs and digital signatures is safely stored in the user's wallet. DID Document may also include other attributes or claims describing the entity, such as service endpoint, delegates, etc. These documents are often expressed using JSON-LD.

DIDs are verifiable; their data usually lives on a **trusted data registry** (typically a blockchain) and can be accessed by anybody. There are multiple **methods** for storing and resolving DIDs. For example, the method `did:ethr` uses a smart contract on Ethereum to store the DID data. Similarly to blockchain addresses, DIDs are pseudonymous; however, they offer additional capabilities such as key rotation, delegation, and a way to link a service endpoint (social media account, etc.) to the identity.

DID is a simple line of text, consisting of three parts:

- `did` URI scheme identifier,
- the identifier for the DID Method, and
- the unique identifier.

<center>
    
<img src="https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg" alt="DID" /><br />
    An example of a DID (<a href="https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg">image source</a>).

</center>

<br />

However, DIDs are not enough to represent our entire identities as they merely provide a "basket" for them. We must fill this basket with all kinds of data, usually presented as credentials in the real world. Credentials are ubiquitous in our daily lives; they take the forms of passports, various licenses and certificates, ownership of bank accounts, and much more. The problem with credentials is that until recently, there had been no standard ways of representing them organized online.
