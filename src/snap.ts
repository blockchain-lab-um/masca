import { Wallet, Response } from "./interfaces";
import { VerifiableCredential } from "@veramo/core";
import { get_id, list_vcs, save_vc, create_vp } from "./utils/veramo_utils";
import { checkForDelegate } from "./utils/snap_utils";

declare let wallet: Wallet;
let vc_id: number;
let vc: VerifiableCredential;
let challenge: string;

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
      case "getDIDAddress":
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
                prompt: `Save VC`,
                description: "Would you like to save the following VC?",
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
        vc_id = parseInt(requestObject.params[0]);
        challenge = requestObject.params[1];
        console.log(vc_id);
        if (vc_id >= 0) {
          let vp = await create_vp(vc_id, challenge);
          return { data: vp };
        } else {
          console.log("Missing parameters: address or vc_id");
          return { error: "Missing parameter: address or vc_id" };
        }
      default:
        throw new Error("Method not found.");
    }
  }
);
