import { VerifiableCredential } from "@veramo/core";
import { OnRpcRequestHandler } from "@metamask/snap-types";
import { togglePopups, changeInfuraToken } from "./rpc/configure";
import { getVCs } from "./rpc/getVCs";
import { getVP } from "./rpc/getVP";
import { saveVC } from "./rpc/saveVC";

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
      return { data: "vcr" };
    case "getVCs":
      console.log("querry before");
      if (request.params) {
        querry = (request as any).params[0];
      }
      return await getVCs(querry);
    case "saveVC":
      vc = (request as any).params[0];
      return await saveVC(vc);
    case "getVP":
      vc_id = (request as any).params[0];
      domain = (request as any).params[1];
      challenge = (request as any).params[2];
      return await getVP(vc_id, domain, challenge);
    case "changeInfuraToken":
      infuraToken = (request as any).params[0];
      return await changeInfuraToken(infuraToken);
    case "togglePopups":
      return await togglePopups();
    default:
      throw new Error("Method not found.");
  }
};
//);
