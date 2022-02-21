//require('util');
import { EthrDID } from "ethr-did";
import {
  Issuer,
  JwtCredentialPayload,
  createVerifiableCredentialJwt,
  JwtPresentationPayload,
  createVerifiablePresentationJwt,
  verifyCredential,
  verifyPresentation,
} from "did-jwt-vc";
import { Wallet } from "ethers";
import { Resolver } from 'did-resolver'
 import { getResolver } from 'ethr-did-resolver'
import { ES256KSigner } from "did-jwt";

export async function createDid() {
  // const INFURA_PROJECT_ID = "6e751a2e5ff741e5a01eab15e4e4a88b";
  // let chainNameOrId = 'rinkeby';
  // const rpcUrl = "https://rinkeby.infura.io/v3/"+INFURA_PROJECT_ID;
  // const didResolver = new Resolver(getResolver({ rpcUrl, name: "rinkeby" }));
  // const wallet = Wallet.createRandom();
  // //Store this in MetaMask state
  // console.log(
  //   wallet.address,
  //   wallet.privateKey.substring(2),
  //   wallet.mnemonic,
  //   wallet.provider
  // );

  // const signer = ES256KSigner(wallet.privateKey.substring(2), false);
  // const issuer = {
  //   did: 'did:ethr:rinkeby:' + wallet.address,
  //   //privateKey: wallet.privateKey.substring(2), chainNameOrId
  //   signer: signer,
  // } as Issuer
  // console.log("Issuer", issuer)
  // const vcPayload: JwtCredentialPayload = {
  //   sub: 'did:ethr:rinkeby:0x435df3eda57154cf8cf7926079881f2912f54db4',
  //   nbf: 1562950282,
  //   vc: {
  //     '@context': ['https://www.w3.org/2018/credentials/v1'],
  //     type: ['VerifiableCredential'],
  //     credentialSubject: {
  //       degree: {
  //         type: 'BachelorDegree',
  //         name: 'Baccalauréat en musiques numériques'
  //       }
  //     }
  //   }
  // }
  // console.log("vcPayload", vcPayload)
  // const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)
  // console.log("VC",vcJwt)
  // const vpPayload: JwtPresentationPayload = {
  //   vp: {
  //     '@context': ['https://www.w3.org/2018/credentials/v1'],
  //     type: ['VerifiablePresentation'],
  //     verifiableCredential: [vcJwt]
  //   }
  // }
  // const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer)
  // console.log("VP",vpJwt)
  //   const verifiedVP = await verifyPresentation(vpJwt, didResolver)
  // console.log(verifiedVP)
  //   const verifiedVC = await verifyCredential(vcJwt, didResolver)
  // console.log(verifiedVC)

  const keypair = EthrDID.createKeyPair();
  const ethrDid = new EthrDID({...keypair});
  console.log("EthrDID", ethrDid);
  const helloJWT = await ethrDid.signJWT({hello: 'world'})
  console.log("Signed JWT", helloJWT);
}
