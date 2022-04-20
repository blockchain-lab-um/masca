import { agent } from "./setup";

export async function list_vcs() {
  const identifiers = await agent.listVCS();

  console.log(`There are ${identifiers.vcs.length} identifiers`);

  if (identifiers.vcs.length > 0) {
    identifiers.vcs.map((id) => {
      console.log(id);
      console.log("..................");
    });
  }
  return identifiers.vcs;
}
