import { Web3Provider } from "@ethersproject/providers";
import { EthrDID } from "ethr-did";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { get_id } from "./veramo_utils";

declare let wallet: any;

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns {Promise<string>} address - MetaMask address
 *
 * @beta
 *
 **/
export async function getCurrentAccount(): Promise<string> {
  try {
    let accounts = (await wallet.request({
      method: "eth_requestAccounts",
    })) as Array<string>;
    const account = accounts[0];
    return account;
  } catch (e) {
    console.log(e);
    return "0x0";
  }
}

const resolveDidEthr = async () => {
  console.log("resolving...", wallet);
  const provider = new Web3Provider(wallet);

  const chainNameOrId = (await provider.getNetwork()).chainId;
  console.log(provider, chainNameOrId);
  let addr = await getCurrentAccount();
  const ethrDid = new EthrDID({
    identifier: addr as string,
    provider,
    chainNameOrId,
  });
  console.log("did ethr", ethrDid);
  const didResolver = new Resolver(
    getResolver({
      name: "rinkeby",
      provider: provider,
    })
  );

  const didDocument = (await didResolver.resolve(ethrDid.did)).didDocument;
  console.log("DID:ETHR DID DOCUMENT:", didDocument);
  let gasPrice = (await provider.getGasPrice()).toNumber() * 2;
  return { ethrDid, didDocument, gasPrice };
};

const checkForKey = async (didDocument, vcKey: string): Promise<boolean> => {
  const veriKeys = didDocument?.verificationMethod;
  let retVal = false;
  if (veriKeys != null) {
    console.log("veri keys", veriKeys);
    veriKeys.map((key) => {
      if (
        key.publicKeyHex?.toString().toUpperCase() ===
        vcKey.substring(2).toUpperCase()
      ) {
        retVal = true;
      }
    });
  }
  return retVal;
};

/**
 * Function that checks if delegate of VC account has been added to the selected MetaMask account.
 * If delegate doesnt exist, it creates a tx to add it to the DID Document of the selected MetaMask account.
 *
 *
 * @private
 *
 * @returns error
 *
 * @beta
 *
 **/
export const checkForDelegate = async () => {
  const { ethrDid, didDocument, gasPrice } = await resolveDidEthr();
  let didAddress = await (await get_id()).did.split(":")[3];
  console.log("did address", didAddress);
  if (didDocument) {
    const res = await checkForKey(didDocument, didAddress);
    if (!res) {
      console.log("Key not implemented yet");
      const result = await wallet.request({
        method: "snap_confirm",
        params: [
          {
            prompt: `Alert`,
            description: "Do you wish to continue?",
            textAreaContent:
              "In order to use VPs a VC account needs to be added to your MetaMask account as a delegate! This is required for VC account to generate VPs! This way your Private Keys stay private and are not needed for this!",
          },
        ],
      });
      if (result) {
        let gasLimit = 100000;

        const txOptions = { gasPrice, gasLimit };
        try {
          const res = await ethrDid.setAttribute(
            "did/pub/Ed25519/veriKey/hex",
            didAddress,
            86400000,
            undefined,
            txOptions
          );
          console.log(res);
          if (res) {
            console.log(
              `Sucessfuly added ${didAddress} as a delegate to the ${ethrDid.did}`
            );
            //Return success
            return true;
          }
        } catch (e) {
          console.log("Rejected", e);
          //Return rejected error
          return false;
        }
      } else {
        //Return user rejected...
        return false;
      }
    } else {
      console.log("Key already exists!");
      return true;
    }
  }
};
