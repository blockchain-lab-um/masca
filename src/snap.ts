import { Wallet } from "./interfaces";
import { createDid } from "./utils/createDid";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(
  async (originString: any, requestObject: { method: any }) => {
    switch (requestObject.method) {
      case "hello":
        await createDid();
        return wallet.request({
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
      default:
        throw new Error("Method not found.");
    }
  }
);
