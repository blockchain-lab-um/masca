import { Wallet, Response } from "./interfaces";
import {} from "./utils/storage";
import { create_ids } from "./veramo/create-identifiers";
import { list_ids } from "./veramo/list-identifiers";
import { save_vc } from "./veramo/save-vcs";
import { VerifiableCredential } from "@veramo/core";
import { list_vcs } from "./veramo/get-vcs";
import { create_vp } from "./veramo/create-vp";
import { agent } from "./veramo/setup";

declare let wallet: Wallet;
let address: string;
let vc_id: number;
let vc: VerifiableCredential;
//// TODO better errors (Return Error msg when trying to save a VC to an uninitialized account, etc.)
//// TODO use checksummed ETH address, not lowercased version.
wallet.registerRpcMessageHandler(
  async (
    originString: any,
    requestObject: { method: any; params: any }
  ): Promise<Response> => {
    console.log("Request object Method:", requestObject);
    switch (requestObject.method) {
      case "getVCs":
        let vcs = await list_vcs();
        return { data: vcs };
      case "getVCAddress":
        let dids = await list_ids();
        if (dids.length > 0) {
          let did;
          dids.map((id) => {
            did = id.did;
          });
          return { data: did };
        } else {
          console.log("Creating new DID...");
          await create_ids();
          let dids = await list_ids();
          if (dids.length > 0) {
            let did;
            dids.map((id) => {
              did = id.did;
            });
            return { data: did };
          }
        }
        return { data: false, error: "Failed to fetch addres" };
      case "saveVC":
        vc = requestObject.params[0];
        if (vc) {
          const result = await wallet.request({
            method: "snap_confirm",
            params: [
              {
                prompt: `User...`,
                description: "Would you like to sign following VC?",
                textAreaContent: JSON.stringify(vc.credentialSubject),
              },
            ],
          });
          if (result) {
            await save_vc(vc);
            return { data: true };
          } else {
            return { data: false, error: "Request declined" };
          }
        } else {
          console.log("Missing parameters: vc");
          return { error: "Missing parameter: vc" };
        }
      case "getVP":
        vc_id = requestObject.params[0];
        if (vc_id) {
          let vp = await create_vp(vc_id);
          return { data: vp };
        } else {
          console.log("Missing parameters: address or vc_id");
          return { error: "Missing parameter: address or vc_id" };
        }
      // case "isInitialized":
      //   address = requestObject.params[0];
      //   if (address) {
      //     let isInitialized = await isVCAccountInitialized(
      //       address.toLowerCase()
      //     );
      //     return { data: isInitialized };
      //   } else return { error: "Missing parameter: address" };
      // case "initialize":
      //   address = requestObject.params[0];
      //   if (address) {
      //     let isInitialized = await isVCAccountInitialized(
      //       address.toLowerCase()
      //     );
      //     if (!isInitialized) {
      //       let initialized = await initializeVCAccount(address.toLowerCase());
      //       return { data: initialized };
      //     } else return { error: "Is already initialized" };
      //   } else return { error: "Missing parameter: address" };
      case "hello":
        await list_ids();
        await create_ids();
        await list_ids();
        return { data: "Have a nice day" };
      case "saveVCVeramo":
        address = requestObject.params[0];
        vc = requestObject.params[1];
        save_vc(vc);
        return { data: "Have a nice day" };
      default:
        throw new Error("Method not found.");
    }
  }
);
