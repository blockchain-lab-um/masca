import { Wallet } from "./interfaces";
import { VerifiableCredential } from "@veramo/core";
import { get_id, list_vcs, save_vc, create_vp } from "./utils/veramo_utils";
import { changeInfuraToken } from "./utils/snap_utils";
import { getConfig } from "./utils/state_utils";
import { OnRpcRequestHandler } from "@metamask/snap-types";
import { updateVCSOnCeramic } from "./utils/ceramic_utils";

declare let wallet: Wallet;
let vc_id: string;
let vc: VerifiableCredential;
let challenge: string;
let domain: string;
let infuraToken: string;
let querry: any;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log("Request:", request);
  console.log("Origin:", origin);
  console.log("-------------------------------------------------------------");
  switch (request.method) {
    case "helloWorld":
      console.log("Hello World!!!");
      const vcr = await updateVCSOnCeramic();
      return { data: "vcr" };
    case "getVCs":
      console.log("querry before");
      if (request.params) {
        querry = (request as any).params[0];
      }
      console.log("querry", querry);
      let vcs = await list_vcs(querry);
      let num = vcs.length;

      //TODO display specific VCs
      const result = await wallet.request({
        method: "snap_confirm",
        params: [
          {
            prompt: `Send VCs`,
            description: "Are you sure you want to send VCs to the dApp?",
            textAreaContent:
              "Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is " +
              num,
          },
        ],
      });
      if (result) {
        return { data: vcs };
      } else {
        return { error: "User rejected" };
      }
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
      vc_id = (request as any).params[0];
      domain = (request as any).params[1];
      challenge = (request as any).params[2];
      console.log(vc_id, domain, challenge);
      if (vc_id) {
        let vp = await create_vp(vc_id, challenge, domain);
        return { data: vp };
      } else {
        console.log("Missing parameters: address or vc_id");
        return { error: "Missing parameter: address or vc_id" };
      }
    case "changeInfuraToken":
      infuraToken = (request as any).params[0];
      if (infuraToken != null && infuraToken != "") {
        const config = await getConfig();
        const result = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: `Change Infura Token`,
              description:
                "Would you like to change the infura token to following?",
              textAreaContent:
                "Current token: " +
                config.infuraToken +
                "\n" +
                "New token: " +
                infuraToken,
            },
          ],
        });
        if (result) {
          await changeInfuraToken(infuraToken);
          return { data: true };
        } else {
          return { data: false, error: "Request declined" };
        }
      } else {
        return { error: "Missing parameter: infuraToken" };
      }
    default:
      throw new Error("Method not found.");
  }
};
//);
