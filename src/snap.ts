import { Wallet, Response, VerifiableCredential } from "./interfaces";
import {
  saveVC,
  getVCs,
  getVP,
  getVCAccountAddress,
  isVCAccountInitialized,
  initializeVCAccount,
} from "./utils/storage";
import { create_ids } from "./veramo/create-identifiers";
import { list_ids } from "./veramo/list-identifiers";
import { save_vc } from "./veramo/save-vcs";

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
        address = requestObject.params[0];
        if (address) {
          let vcs = await getVCs(address.toLowerCase());
          return { data: vcs };
        } else {
          console.log("Missing parameter: address");
          return { error: "Missing parameter: address" };
        }
      case "getVCAddress":
        address = requestObject.params[0];
        console.log("Getting vc Address: ", address);
        if (address) {
          let vcAddress = await getVCAccountAddress(address.toLowerCase());
          return { data: vcAddress };
        } else {
          console.log("Missing parameter: address");
          return { error: "Missing parameter: address" };
        }
      case "saveVC":
        address = requestObject.params[0];
        vc = requestObject.params[1];
        if (address && vc) {
          const result = await wallet.request({
            method: "snap_confirm",
            params: [
              {
                prompt: `User ${address.substring(0, 15)}...`,
                description: "Would you like to sign following VC?",
                textAreaContent: JSON.stringify(vc.credentialSubject),
              },
            ],
          });
          if (result) {
            await saveVC(address.toLowerCase(), vc);
            return { data: true };
          } else {
            return { data: false, error: "Request declined" };
          }
        } else {
          console.log("Missing parameters: address or vc");
          return { error: "Missing parameter: address or vc" };
        }
      case "getVP":
        address = requestObject.params[0];
        vc_id = requestObject.params[1];
        if (address && vc_id) {
          let vp = await getVP(address.toLowerCase(), vc_id);
          return { data: vp };
        } else {
          console.log("Missing parameters: address or vc_id");
          return { error: "Missing parameter: address or vc_id" };
        }
      case "isInitialized":
        address = requestObject.params[0];
        if (address) {
          let isInitialized = await isVCAccountInitialized(
            address.toLowerCase()
          );
          return { data: isInitialized };
        } else return { error: "Missing parameter: address" };
      case "initialize":
        address = requestObject.params[0];
        if (address) {
          let isInitialized = await isVCAccountInitialized(
            address.toLowerCase()
          );
          if (!isInitialized) {
            let initialized = await initializeVCAccount(address.toLowerCase());
            return { data: initialized };
          } else return { error: "Is already initialized" };
        } else return { error: "Missing parameter: address" };
      case "hello":
        // let state = await wallet.request({
        //   method: "snap_manageState",
        //   params: ["get"],
        // });
        // console.log("State", state);
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
