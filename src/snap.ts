import { Wallet } from "./interfaces";
import {
  saveVC,
  getVC,
  clearState,
  initializeStorage,
  getPrivateKey,
  isInitialized,
  getVcAddress,
  getVcs,
  getVP,
} from "./utils/storage";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(
  async (originString: any, requestObject: { method: any; params: any }) => {
    console.log("Request object Method:", requestObject);
    switch (requestObject.method) {
      case "init":
        console.log("initializing storage...");
        await initializeStorage();
        return true;
      case "isInitialized":
        const res = await isInitialized();
        return res;
      case "hello":
        const data = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: `Hello, ${originString}!`,
              description: "Would you like to save VC?",
              textAreaContent: JSON.stringify(requestObject.params[0]),
            },
          ],
        });
        if (data) {
          try {
            await saveVC(requestObject.params[0]);
          } catch (e) {
            return (e as Error).message;
          }
        }
        return data;
      case "test_vp":
        console.log("Testing first VP");
        return "test";
      case "getVCAddress":
        const address = await getVcAddress();
        return address;
      case "get_vcs":
        const vcs = await getVcs();
        return vcs;
      case "save_vc":
        const vc = requestObject.params[0];
        const vc_data = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: `Hello, ${originString}!`,
              description: "Would you like to save VC?",
              textAreaContent: JSON.stringify(vc.credentialSubject),
            },
          ],
        });
        if (vc_data) {
          try {
            await saveVC(vc);
          } catch (e) {
            return (e as Error).message;
          }
        }
        return vc_data;
      case "get_vp":
        const vc_list = await getVcs();
        if (vc_list == null) {
          return "Error getting vcs...";
        }
        let id = requestObject.params[0] as number;
        console.log("Looking for id", id);
        if (id > vc_list.length) {
          return "Error, invalid VC id, or vc_list empty...";
        }
        const result = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: "Would you like to sign the VC?",
              description: "Would you like to sign following VC?",
              textAreaContent: JSON.stringify(vc_list[id].credentialSubject),
            },
          ],
        });
        if (result === true) {
          //create VP
          const verifiable_presentation = await getVP(id);
          return verifiable_presentation;
        } else {
          return "Declined";
        }
      default:
        throw new Error("Method not found.");
    }
  }
);
