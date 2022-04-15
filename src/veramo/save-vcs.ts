import { VerifiableCredential } from "@veramo/core";
import { agent } from "./setup";

export async function save_vc(vc: VerifiableCredential) {
  console.log(await agent.saveVC({ vc: vc }));

  const vcs = await agent.listVCS();

  console.log(`There are ${vcs.vcs.length} identifiers`);

  if (vcs.vcs.length > 0) {
    vcs.vcs.map((id) => {
      console.log(id);
      console.log("..................");
    });
  }
}
