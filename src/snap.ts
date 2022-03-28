import { Wallet, Response, VerifiableCredential } from "./interfaces";
import { saveVC, getVCs, getVP, getVCAccountAddress } from "./utils/storage";

declare let wallet: Wallet;
let address: string;
let vc_id: number;
let vc: VerifiableCredential;

wallet.registerRpcMessageHandler(
  async (
    originString: any,
    requestObject: { method: any; params: any }
  ): Promise<Response> => {
    console.log("Request object Method:", requestObject);
    switch (requestObject.method) {
      case "getVCs":
        address = requestObject.params[0];
        if (address) {
          let vcs = await getVCs(address);
          return { data: vcs };
        } else {
          console.log("Missing parameter: address");
          return { error: "Missing parameter: address" };
        }
      case "getVCAddress":
        address = requestObject.params[0];
        console.log("Getting vc Address: ", address);
        if (address) {
          let vcAddress = await getVCAccountAddress(address);
          return { data: vcAddress };
        } else {
          console.log("Missing parameter: address");
          return { error: "Missing parameter: address" };
        }
      case "saveVC":
        address = requestObject.params[0];
        vc = requestObject.params[1];
        if (address && vc) {
          await saveVC(address, vc);
          return { data: true };
        } else {
          console.log("Missing parameters: address or vc");
          return { error: "Missing parameter: address or vc" };
        }
      case "getVP":
        address = requestObject.params[0];
        vc_id = requestObject.params[1];
        if (address && vc_id) {
          let vp = await getVP(address, vc_id);
          return { data: vp };
        } else {
          console.log("Missing parameters: address or vc_id");
          return { error: "Missing parameter: address or vc_id" };
        }
      case "hello":
        console.log("Recieved hello!");
        return { data: "Have a nice day" };
      default:
        throw new Error("Method not found.");
    }
  }
);
