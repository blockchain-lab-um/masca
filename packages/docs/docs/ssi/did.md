---
sidebar_position: 1
---

# Decentralized Identifiers (DID)

## Motivation

We often use credentials in form of physical cards to provide proof of our identity and claims about us. Credentials are ubiquitous in our daily lives; they take the forms of passports, various licenses and certificates, ownership of bank accounts, and much more. The problem with credentials is that in digital world, there were no universally accepted standards for expressing, exchanging them.

We often use emails and phone numbers to identify online and log into websites, services and apps. Our credentials are often handled and stored by these services and are often incompatible between different services. We lose our privacy as all of our data is visible to service providers. This also makes our data vulnerable to hacks. Decentralized identifiers change all of this.

## DIDs

**Decentralized Identifiers** ([W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/)), also **DIDs** are unique and persistent identifiers (URI) that enable verifiable and decentralized identity. They are entirely controlled by the identity owner and are independent of centralized authorities. Individuals can create as many DIDs as they wish and use each in different contexts to prevent data correlation.

In practice DIDs are strings of letters and numbers. An example of a DID:

`did:web:feri.um.si/professor/13461`

A DID comes with a private and a public key and allow the owner to prove cryptographic control over it. Aside being a globally unique identifier, DIDs can also enable private and secure connections between two parties and can be verified anywhere at any time.

### Structure of a DID

DID is a simple line of text, consisting of three parts:

- `did` URI scheme identifier,
- the identifier for the DID Method, and
- the unique identifier.

<center>
    
<img src="https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg" alt="DID" /><br />
    An example of a DID (<a href="https://www.w3.org/TR/did-core/diagrams/parts-of-a-did.svg">image source</a>).

</center>

<br />

### DID Method

DIDs are verifiable; their data usually lives on a **trusted data registry** (typically a blockchain) and can be accessed by anybody. There are multiple **methods** for storing and resolving DIDs. For example, the method `did:ethr` uses a smart contract on Ethereum to store the DID data, while method `did:web` uses web domains. Similarly to blockchain addresses, DIDs are pseudonymous; however, they offer additional capabilities such as key rotation, delegation, and a way to link a service endpoint (social media account, etc.) to the identity.

### DID Document

**DID Document** forms the root record for a DID and is a set of data that describes a DID, including mechanisms, such as public keys and pseudonymous biometrics, that an entity can use to authenticate itself as the DID. While anyone can obtain a public key from the DID document, a private key used for proofs and digital signatures is safely stored in the user's snap. DID Document may also include other attributes or claims describing the entity, such as service endpoint, delegates, etc. These documents are often expressed using JSON-LD.

## Differences between Centralized and Decentralized identifiers

![Differences](https://i.imgur.com/8QimX0x.png)
