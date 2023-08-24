---
sidebar_position: 11
---

# FAQ's

### What is Decentralized Identity and why should I care?

Decentralized Identity (often referred to as "Self-Sovereign Identity") is a digital identity that is controlled by the individual (or organization) to which it refers, rather than a centralized authority such as a government or tech company. Decentralized Identity uses blockchain technology and cryptographic methods to secure personal data.

Decentralized Identity aims to give power back to the user:

- Users control their own data and get to choose what information to share and with whom,
- no authority can revoke or suspend Users digital identity as it's not controlled by a third party,
- users can use their digital identity across multiple platforms, services, or even countries, without the need for multiple accounts and passwords,
- and much more.

Learn more about [Decentralized Identity](/docs/category/decentralized-or-self-sovereign-identity-ssi).

### Why not use NFTs instead of Verifiable Credentials?

NFTs and Verifiable Credentials share some similarities, like that they are both ways of digitally proving ownership that can be cryptographically verified, however they differ in their functionality.

NFTs are primarily used to establish ownership and uniqueness of digital assets. They are associated with public wallet addresses. Everybody is able to see every NFT a has owned or owns. This is beneficial in some cases (e.g. collections), but has obvious downsides for privacy. NFTs could theoretically be used in an identity context, but their lack of privacy makes them far from an ideal solution.

Verifiable Credentials (VCs) are primarily used to enable individuals and organizations to prove claims about themselves or their activities in a way that is secure, privacy-preserving and easily verifiable. They are associated with Decentralized Identifiers (DIDs). VCs are not public and are instead selectively shared with verifying parties as needed. VCs can also support selective disclosure, allowing users to reveal only certain parts of a credential rather than disclosing it entirely. This is important for privacy and is a feature not supported by NFTs.

### Why do I need to use Masca for Decentralized Identity?

MetaMask does not natively support DIDs. Masca allows you to use create, manage and use multiple DIDs in MetaMask.

Masca also allows you to store Credentials in MetaMask (or any other supported store).

### How to install Masca?

1. First you need to install [MetaMask Flask](https://metamask.io/flask/) and then install [Masca](https://www.npmjs.com/package/@blockchain-lab-um/masca) from the npm registry. We recommend that you use the latest version of Masca.
2. Connect to a dApp that supports Masca and accept the connection & installation prompts.
3. Check out our [dApp](https://masca.io) to start using Masca.

### Why do I have to use MetaMask Flask?

Snaps are only available on the developer preview version of MetaMask, called MetaMask Flask. Snaps will be released in MetaMask later this year.

### Why can't I install Masca in MetaMask?

Snaps are only available on the developer preview version of MetaMask, called MetaMask Flask. Snaps will be released in MetaMask later this year.

### Can I use Masca without a dApp?

No. For the moment, the only way to interact with Masca is through a dApp. We have built a [dedicated dApp](https://masca.io) that allows you to view and manage your DIDs and Credentials.

MetaMask plans to add support for Snaps UI in MetaMask, which will allow us to implement custom UI to interact with Masca directly in MetaMask extension.

### Is Masca available on the Mobile MetaMask app?

Snaps are only available in browser-based extension MetaMask Flask, however there are plans to add support for snaps in the Mobile extension.

### What happens if I delete Masca in MetaMask?

All of your locally stored credentials will be lost! Reinstalling Masca will automatically recover all DIDs & Credentials stored on Ceramic Networks.

### Are my Private Keys safe?

Yes. Masca does not have access to users private keys! [Learn](./masca/design.md) how Masca handles private keys.

### Are my Credentials private?

Yes and No. Credentials can be stored directly in Masca or on Ceramic Network. Credentials stored in Masca are completely private and only available for user to see. Credentials stored on Ceramic Network are public for anybody to see (though accessing them is not as straightforward as searching address in a block explorer). We recommend users to save all Credentials that contain sensitive information in Masca.

Depending on the use case, dApps are likely to request Masca to share credentials with them. Always double check who you're sharing Credentials with as hostile dApps could potentially save your credentials.
