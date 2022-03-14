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
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { ES256KSigner } from "did-jwt";
//const util = require("util");

// Required to set up a suite instance with private key
export function generatePkey() {
  const wallet = Wallet.createRandom();
  console.log(
    "Wallet address:",
    wallet.address,
    wallet.privateKey.substring(2)
  );
  return [wallet.address, wallet.privateKey.substring(2)];
}

export async function createPresentation(vc, vc_pkey, vc_address) {
  const signer = ES256KSigner(vc_pkey, false);
  const issuer = new EthrDID({
    //did: "did:ethr:rinkeby:" + wallet.address,
    //privateKey: wallet.privateKey.substring(2), chainNameOrId
    identifier: vc_address,
    signer: signer,
  }) as Issuer;
  //console.log("VP VC", util.inspect(vc, false, null, true));
  // console.log("inside vp", vc.credentialSubject);
  // console.log("inside vp sub id", vc.credentialSubject.id);
  // console.log("inside vp", vc.issuer);
  // console.log("inside vp iss id", vc.issuer.id);
  const t1 = new Date(vc.issuanceDate).getTime() / 1000;
  const vcPayload: JwtCredentialPayload = {
    sub: vc.credentialSubject.id,
    nbf: t1,
    iss: vc.issuer.id,
    vc: vc,
  };
  console.log("vcPayload", vcPayload);

  //Create VC
  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  console.log("VC", vcJwt);

  //Create VP
  const vpPayload: JwtPresentationPayload = {
    vp: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [vcJwt],
    },
  };
  const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer);
  console.log("VP", vpJwt);
  return vpJwt;
}
