//import { agent } from "../veramo/setup";
import { Wallet } from "ethers";
import { generateEd25519Key } from "@spruceid/didkit-wasm";

export async function createDid() {
  const wallet = Wallet.createRandom();
  //Store this in MetaMask state
  console.log(
    wallet.address,
    wallet.privateKey.substring(2),
    wallet.mnemonic,
    wallet.provider
  );

  const key = generateEd25519Key();

  //   const myDID = await agent.didManagerImport({
  //     did: `did:ethr:rinkeby:${wallet.address}`,
  //     provider: "did:ethr:rinkeby",
  //     controllerKeyId: `did:ethr:rinkeby:${wallet.address}#controllerKey`,
  //     keys: [
  //       {
  //         privateKeyHex: wallet.privateKey.substring(2),
  //         kid: `did:ethr:${wallet.address}#controller`,
  //         type: "Secp256k1",
  //         kms: "local", // or whatever KMS you configured for your agent
  //       },
  //     ],
  //   });

  //   console.log(myDID);
  //   // let createdIdentifier = await agent.didManagerCreate();
  //   // createdIdentifier = (await agent.didManagerFind({})).filter((id) => {
  //   //   // get identifier with private key
  //   //   return id.did === createdIdentifier.did;
  //   // })[0];
  //   // console.log(createdIdentifier);

  //   const identifiers = await agent.didManagerFind();

  //   console.log(`There are ${identifiers.length} identifiers`);

  //   if (identifiers.length > 0) {
  //     identifiers.map((id) => {
  //       console.log(id);
  //       console.log("..................");
  //     });
  //   }
}
