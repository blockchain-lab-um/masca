import { Wallet } from "./interfaces";
import { createDid } from "./utils/createDid";
import { saveVC, getVC, clearState } from "./utils/storage";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(
  async (originString: any, requestObject: { method: any; params: any }) => {
    console.log("Request object Method:", requestObject.method);
    switch (requestObject.method) {
      case "hello":
        await createDid();
        const data = await wallet.request({
          method: "snap_confirm",
          params: [
            {
              prompt: `Hello, ${originString}!`,
              description:
                "This custom confirmation is just for display purposes.",
              textAreaContent:
                "But you can edit the snap source code to make it do something, if you want to!",
            },
          ],
        });
        await saveVC(requestObject.params[0]);
        const state = await getVC();
        console.log("First state");
        await clearState();
        const newState = await getVC();
        console.log("Updated state");
        return data;
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
