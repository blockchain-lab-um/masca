import { Wallet } from "./interfaces";
import {
  saveVC,
  getVC,
  clearState,
  initializeStorage,
  getPrivateKey,
  isInitialized,
} from "./utils/storage";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(
  async (originString: any, requestObject: { method: any; params: any }) => {
    console.log("Request object Method:", requestObject);
    switch (requestObject.method) {
      case "init":
        await initializeStorage();
        const state2 = await getVC();
        console.log("Priv key state");
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
        const state = await getVC();
        console.log("Testing first VP");
        return;
      case "save_vc":
        //await createDid();
        const vc = requestObject.params[0];
        console.log("Req obj", vc);
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
        const result = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: "Would you like to take the action?",
              description: "The action is...",
              textAreaContent: "Very detailed information about the action...",
            },
          ],
        });
        console.log("res", result);
        if (result === true) {
          return "Was True";
        } else {
          return "Was false";
        }
      default:
        throw new Error("Method not found.");
    }
  }
);
