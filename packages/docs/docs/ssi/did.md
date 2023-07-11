---
sidebar_position: 1
---

# Decentralized Identifiers (DID)

## Motivation

We often use credentials as physical cards to prove our identity and claims about us. Credentials are ubiquitous in our daily lives; they take the forms of passports, various licenses and certificates, ownership of bank accounts, and much more. The problem with credentials is that there are no universally accepted standards for expressing and exchanging them in the digital world.

We often use emails and phone numbers to identify online and log into websites, services, and apps. Our credentials are handled and stored by these services and are often incompatible with each other. We lose our privacy as all our data is visible to service providers introducing a whole new surface for new attack vectors. Decentralized identifiers change all of this.

## DIDs

**Decentralized Identifiers** ([W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/)), or **DIDs** for short, are unique and persistent identifiers (URI) that enable verifiable and decentralized identities. The identity owners entirely control them and are independent of centralized authorities. Individuals can create as many DIDs as they wish and use each in different contexts to prevent data correlation.

In practice, DIDs are strings of letters and numbers. An example of a DID:

`did:web:feri.um.si/professor/13461`

A DID consists of a cryptographic key pair (a public and a private key), allowing the owner to prove control over it. Besides being globally unique identifiers, DIDs can enable private and secure connections between two parties and be verified anywhere from anywhere at any time.

### Structure of a DID

DID is just a simple string consisting of three parts:

- `did` URI scheme identifier,
- the identifier for the DID Method, and
- the unique identifier.

<center>

![An example of a DID](https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg)

An example of a DID ([image source](https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg)).

</center>

### DID Method

DIDs are verifiable; their data usually lives on a **trusted data registry** (typically a blockchain) and can be accessed by anybody. There are multiple **methods** for storing and resolving DIDs. For example, the `did:ethr` method uses a smart contract on Ethereum to store the DID data, while the `did:web` method uses web domains. Similarly to blockchain addresses, DIDs are pseudonymous; however, they offer additional capabilities such as key rotation, delegation, and a way to link a service endpoint (social media account, etc.) to the identity.

### DID Document

**DID Document** forms the root record for a DID and is a set of data that describes a DID, including mechanisms, such as public keys and pseudonymous biometrics, that an entity can use to authenticate itself as the DID. While anyone can obtain a public key from the DID document, a private key used for proofs and digital signatures is safely stored in Masca. DID Document may also include other attributes or claims describing the entity, such as service endpoint, delegates, etc. These documents are often expressed using JSON-LD.

## Differences between Centralized and Decentralized identifiers

<center>

![Differences](https://i.imgur.com/8QimX0x.png)

Key differences between centralized and decentralized identifiers ([image source](https://www.dock.io/post/verifiable-credentials)).

</center>
