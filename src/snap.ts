import { Wallet, Response } from "./interfaces";
import { VerifiableCredential } from "@veramo/core";
import { get_id, list_vcs, save_vc, create_vp } from "./utils/veramo_utils";

declare let wallet: Wallet;
let vc_id: number;
let vc: VerifiableCredential;

/**
 * @TODO better errors (Return Error msg when trying to save a VC to an uninitialized account, etc.)
 */

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
        let did = await get_id();
        if (did != null) {
          return { data: did.did.split(":")[3] };
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
      case "hello":
        console.log("test function");
        return { data: "Have a nice day" };
      case "saveVCVeramo":
        console.log("test function 2");
        return { data: "Have a nice day" };
      default:
        throw new Error("Method not found.");
    }
  }
);
