import { list_vcs } from "../utils/veramo_utils";
import { Response } from "../interfaces";
import { getConfig } from "../utils/state_utils";

export async function getVCs(querry?: any): Promise<Response> {
  console.log("querry", querry);
  const vcs = await list_vcs(querry);
  const config = await getConfig();
  console.log("VCs: ", vcs);

  const result =
    config.dApp.disablePopups ||
    (await wallet.request({
      method: "snap_confirm",
      params: [
        {
          prompt: `Send VCs`,
          description: "Are you sure you want to send VCs to the dApp?",
          textAreaContent:
            "Some dApps are less secure than others and could save data from VCs against your will. Be careful where you send your private VCs! Number of VCs submitted is " +
            vcs.length.toString(),
        },
      ],
    }));
  if (result) {
    return { data: { vcs: vcs } };
  } else {
    return { error: "User rejected" };
  }
}
