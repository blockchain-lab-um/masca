import { Wallet, Response } from "./interfaces";
import { VerifiableCredential } from "@veramo/core";
import {
  get_id,
  list_vcs,
  save_vc,
  create_vp,
  create_vc,
} from "./utils/veramo_utils";
import { changeInfuraToken } from "./utils/snap_utils";
//import { OnRpcRequestHandler } from "@metamask/snap-types";

declare let wallet: Wallet;
let vc_id: number;
let vc: VerifiableCredential;
let challenge: string;
let domain: string;
let infuraToken: string;

//0.16.0
// export const onRpcRequest: OnRpcRequestHandler = async ({
//   origin,
//   request,
// }) => {
//0.15.0
wallet.registerRpcMessageHandler(
  async (
    originString: any,
    request: { method: any; params: any }
  ): Promise<Response> => {
    console.log("Request:", request);
    console.log("Origin:", origin);
    console.log(
      "-------------------------------------------------------------"
    );
    switch (request.method) {
      case "helloWorld":
        console.log("Hello World!!!");
        const vcr = await create_vc();
        return { data: vcr };
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
        vc = (request as any).params[0];
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
        vc_id = parseInt((request as any).params[0]);
        domain = (request as any).params[1];
        challenge = (request as any).params[2];
        console.log(vc_id);
        if (vc_id >= 0) {
          let vp = await create_vp(vc_id, challenge, domain);
          return { data: vp };
        } else {
          console.log("Missing parameters: address or vc_id");
          return { error: "Missing parameter: address or vc_id" };
        }
      case "changeInfuraToken":
        infuraToken = (request as any).params[0];
        if (infuraToken != null && infuraToken != "") {
          await changeInfuraToken(infuraToken);
        }
      default:
        throw new Error("Method not found.");
    }
  }
);
